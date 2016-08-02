import {div, h1, p, strong, pre, code, hr, img, button} from '@cycle/dom'
import xs from 'xstream'
import classes from 'classes'

import CreateUser from 'components/create-user'
import UserList from 'components/user-list'

function Welcome (sources) {
	let createUserForm = CreateUser(sources),
		userCreated$ = createUserForm.created$,
		userList = UserList(Object.assign({}, sources, {refresh$: userCreated$})),

		render = ([createUser, users]) => {
			return div([
				h1('Welcome to your new HapiCycle application!'),
				createUser,
				hr(),
				users
			])
		}

	return {
		DOM: xs.combine(createUserForm.DOM, userList.DOM).map(render),
		HTTP: xs.merge(

			// merge createUser's HTTP sink
			createUserForm.HTTP,

			// merge userList's HTTP sink
			userList.HTTP
		)
	}
}

export default Welcome
