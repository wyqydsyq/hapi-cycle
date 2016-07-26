import {div, form, fieldset, legend, label, input, button, i, strong} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import isolate from '@cycle/isolate';
import xs from 'xstream';
import classes from 'dependencies/classes';

import styles from '../form/styles.less';

import LabelInput from 'components/label-input';

const dataIni = {
	email: '',
	password: '',
	remember: null
},
stateIni = {
	alerts: [],
	submitting: false,
	data: dataIni
};

function action (type, data = {}) {
	return {
		type,
		effect: data
	}
}

function intent ({DOM, HTTP}) {
	return {
		input$: DOM.select('input').events('input').map(ev => action('input', {target: ev.target.name, value: ev.target.value})),
		submit$: DOM.select('button').events('click').map(ev => action('submit', {target: ev.target.name})),
		responses$: HTTP.select('user')
			.map(response$ => response$.replaceError(error => {
				let res = error.response;
				res.error = true;
				return xs.of(res);
			}))
			.flatten()
			.map(r => {
				console.log('Req: ', r.request.method + ' ' + r.request.url)
				return r
			})
			.filter(r => r.request.method == 'POST')
			.map(res => action('response', {
				success: (typeof res.error == 'undefined' || !res.error),
				text: ((typeof res.error == 'undefined' || !res.error) && res.body.length) ? 'User created.' : 'An unknown error occured, please try again later.'
			}))
	}
}

function model (intent) {
	return xs.merge(
		intent.input$.map(action => state => {
			state.data[action.effect.target] = action.effect.value;
			return state;
		}),
		intent.submit$.map(action => state => {
			state.submitting = true;
			state.alerts = [];

			return state;
		}),
		intent.responses$.map(action => state => {
			state.submitting = false;

			let alert = {
				title: action.effect.title || '',
				text: action.effect.text
			};

			if (action.effect.success) alert.className = 'alert-success';
			else alert.className = 'alert-danger';

			state.alerts.push(alert);

			return state;
		})
	).fold((state, method) => method(state), stateIni)
}

function CreateUser (sources) {
	let actions = intent(sources),
		state$ = model(actions),
		render = (state) => {
			let emailField = LabelInput({state, props: {
				name: 'email',
				type: 'email',
				label: 'Email'
			}}),
			passwordField = LabelInput({state, props: {
				name: 'password',
				type: 'password',
				label: 'Password'
			}});

			return form({class: classes(styles.form, styles.formHorizontal)}, [
				fieldset([
					// show alerts if there's any
					state.alerts.length ? div('.alerts',
						state.alerts.map(alert => div({class: classes(styles.alert, styles[alert.className || 'alert-info'])}, [
							(typeof alert.title != 'undefined' && alert.title) ? strong(alert.title): '',
							alert.text
						]))
					) : '',
					legend({class: classes(styles.legend)}, 'Create User'),
					emailField.DOM,
					passwordField.DOM,
					div([
						button({class: classes(styles.submit), props: {type: 'button', disabled: state.submitting}}, [
							state.submitting
							? i({class: classes(styles.fa, styles.faSpinner, styles.faSpin)})
							: i({class: classes(styles.fa, styles.faUserPlus)}),
							state.submitting ? ' Creating...' : ' Create'
						])
					])
				])
			])
		},
		vtree$ = state$.map(render);

	return {
		DOM: vtree$,
		HTTP: xs.combine(state$.take(1), actions.submit$).map(([state, action]) => ({
			url: 'http://localhost:1337/users',
			category: 'user',
			method: 'POST',
			type: 'application/x-www-form-urlencoded',
			send: state.data
		})),
		state$
	}
};

export default CreateUser
