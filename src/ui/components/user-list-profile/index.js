import {div, button, img, strong} from '@cycle/dom'
import isolate from '@cycle/isolate'
import xs from 'xstream'
import MD5 from 'crypto-js/md5'

import classes from 'classes'
import normalizeHTTPErrors from 'normalizeHTTPErrors'

import styles from './styles.less'

function UserProfile ({DOM, HTTP, user$}) {
	let remove$ = DOM.select('button').events('click').map(ev => ({
				url: `http://${HOST}/api/users`,
				category: 'user',
				method: 'DELETE',
				send: {
					id: ev.currentTarget['data-id']
				}
			})),
		removed$ = HTTP.select('user')
			.map(normalizeHTTPErrors)
			.flatten()
			.filter(res => res.request.method == 'DELETE')
			.map(res => res.body),
		alerts$ = removed$.map(users => {
			return {
				title: 'Deleted',
				text: 'User ' + users[0].email + ' deleted.'
			}
		});

	return {
		DOM: user$.map(user =>
			div({class: classes(styles.userProfile)}, [
				div({class: classes(styles.userGravatar)}, [img({attrs: {
					src: 'https://www.gravatar.com/avatar/' + MD5(user.email.toLowerCase().trim())
				}})]),
				div({class: classes(styles.userDetails)}, [
					div([strong(['Email: ']), user.email]),
					div([strong(['Created: ']), user.createdAt]),
					button('.deleteUser', {class: classes(styles.deleteUser), props: {
						'data-id': user.id
					}}, ['Delete'])
				])
			])),
		HTTP: remove$,
		removed$,
		alerts$
	}
}

export default sources => isolate(UserProfile)(sources)
