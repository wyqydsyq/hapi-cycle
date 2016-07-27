import {div, h1, p, strong, pre, code, hr, img, button} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import xs from 'xstream'
import MD5 from 'crypto-js/md5'
import classes from 'classes'

import styles from './styles.less'

import CreateUser from 'components/create-user'

function Welcome (sources) {
	let createUserForm = CreateUser(sources),

		// normalize incoming user responses
		userResponse$ = sources.HTTP.select('user')
			.map(res$ => res$.replaceError(error => {
				let res = error.res || {body: error, request: {method: null}}
				res.error = true
				return xs.of(res)
			}))
			.flatten(),

		// response from creating a user
		userCreated$ = createUserForm.created$,

		// response from deleting a user
		userDeleted$ = userResponse$
		.filter(res => res.request.method == 'DELETE')
		.map(res => res.body),

		// response from getting user list
		userList$ = userResponse$
			.filter(res => res.request.method == 'GET')
			.map(res => res.body),

		// request to delete a user
		userDelete$ = sources.DOM.select('button.deleteUser').events('click').map(ev => ({
			url: `http://${HOST}/users`,
			category: 'user',
			method: 'DELETE',
			send: {
				email: ev.currentTarget['data-email']
			}
		})),

		// request to get users
		getUsersList = {
			url: `http://${HOST}/users`,
			category: 'user',
			method: 'GET'
		},

		render = ([users, createUserForm]) => {
			let userList = users => {
				if (!users.length) {
					return [p('Your ORM doesn\'t have any users yet.')]
				} else {
					return [
						p('Your ORM has the following users:'),
						div('.userList', users.map(user => div({class: classes(styles.userProfile)}, [
							div({class: classes(styles.userGravatar)}, [img({attrs: {
								src: 'https://www.gravatar.com/avatar/' + MD5(user.email.toLowerCase().trim())
							}})]),
							div({class: classes(styles.userDetails)}, [
								div([strong(['Email: ']), user.email]),
								div([strong(['Created: ']), user.createdAt]),
								button('.deleteUser', {class: classes(styles.deleteUser), props: {
									'data-email': user.email
								}}, ['Delete'])
							])
						])))
					]
				}
			}

			return div([
				h1('Welcome to your new HapiCycle application!'),
				createUserForm,
				hr()
			].concat(userList(users)))
		}

	return {
		DOM: xs.combine(userList$, createUserForm.DOM).map(render),
		HTTP: xs.merge(
			xs.of(getUsersList),

			// merge createUser's HTTP sink
			createUserForm.HTTP,

			// handle deleteUser requests
			userDelete$,

			// actions/responses that should trigger a refresh
			xs.merge(userCreated$, userDeleted$).mapTo(getUsersList)
		)
	}
}

export default Welcome
