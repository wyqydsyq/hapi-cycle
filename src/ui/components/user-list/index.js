import {div, h1, p, strong, pre, code, hr, img, button} from '@cycle/dom'
import xs from 'xstream'
import classes from 'classes'
import action from 'action'
import MD5 from 'crypto-js/md5'

import styles from './styles.less'

function UserList (sources) {

	let getUsersList = {
		url: `http://${HOST}/api/users`,
		category: 'user',
		method: 'GET'
	},

	// normalize incoming user responses
	userResponse$ = sources.HTTP.select('user')
		.map(res$ => res$.replaceError(error => {
			let res = error.res || {body: error, request: {method: null}}
			res.error = true
			return xs.of(res)
		}))
		.flatten(),

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
		url: `http://${HOST}/api/users`,
		category: 'user',
		method: 'DELETE',
		send: {
			email: ev.currentTarget['data-email']
		}
	}))

	return {
		DOM: userList$.map(users => {
			if (!users.length) {
				return div('Your ORM doesn\'t have any users yet.')
			} else {
				return div([
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
				])
			}
		}),
		HTTP: xs.merge(
			xs.of(getUsersList),

			userDelete$,

			// actions that trigger refreshes
			xs.merge(sources.refresh$, userDeleted$).mapTo(getUsersList)
		)
	}
}

export default UserList
