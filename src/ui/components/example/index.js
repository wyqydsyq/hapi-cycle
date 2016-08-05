import {div, nav, a, i, hr} from '@cycle/dom'
import xs from 'xstream'
import classes from 'classes'

import form from 'components/form/styles'

import Alerts from 'components/alerts'
import CreateUser from 'components/create-user'
import UserList from 'components/user-list'

function Example (sources) { console.log('example')
	let createUserForm = CreateUser(sources),
		userList = UserList(Object.assign({}, sources, {refresh$: createUserForm.created$})),
		alerts = Alerts({DOM: sources.DOM, add$: xs.merge(createUserForm.alerts$, userList.alerts$)}),

		render = ([alerts, createUser, users]) => {
			return div('.example', [
				nav([
					a({props: {href: '/'}, class: classes(form.submit)}, ['Readme']),
					a({props: {href: 'https://github.com/wyqydsyq/hapi-cycle', rel: 'external'}, class: classes(form.submit)}, ['GitHub', ' ', i({class: classes(form.fa, form.faGithub)})]),
				]),
				hr(),
				alerts,
				createUser,
				hr(),
				users
			])
		}

	return {
		DOM: xs.combine(alerts.DOM, createUserForm.DOM, userList.DOM).map(render),
		HTTP: xs.merge(

			// merge createUser's HTTP sink
			createUserForm.HTTP,

			// merge userList's HTTP sink
			userList.HTTP
		)
	}
}

export default Example
