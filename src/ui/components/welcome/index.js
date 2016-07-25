import {div, h1, p, strong, pre, code, hr} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import xs from 'xstream';
import classes from 'dependencies/classes';

import CreateUser from 'components/create-user';

function Welcome (sources) {
	let createUser = CreateUser(sources),
		users$ = sources.HTTP.select('user')
			.map(res$ => res$.replaceError(error => {
				let res = error.res;
				res.error = true;
				return xs.of(res);
			}))
			.flatten()
			.filter(res => res.request.method == 'GET')
			.map(res => res.body),
		getUsers = {
			url: 'http://localhost:1337/users',
			category: 'user',
			method: 'GET'
		},
		render = (users) => { console.log('Users: ', users)
			return div([
				h1('Welcome to your new Cycle.js + Hapi application!'),
				p('Your ORM has the following users:'),
				pre([
					code(JSON.stringify(users, null, "\t"))
				]),
				hr(),
				createUser.DOM
			])
		};
	return {
		DOM: users$.map(render),
		HTTP: xs.merge(
			// request users for initial state
			xs.of(getUsers),

			// handle create requests from child form
			createUser.HTTP,

			// create responses should map to a refresh
			sources.HTTP.select('user').flatten()
				.filter(r => r.request.method == 'POST')
				.mapTo(getUsers)
		)
	}
};

export default Welcome
