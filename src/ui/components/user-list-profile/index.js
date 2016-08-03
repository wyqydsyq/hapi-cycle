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
					email: ev.currentTarget['data-email']
				}
			})),
		removed$ = HTTP.select('user')
			.map(normalizeHTTPErrors)
			.flatten()
			.filter(res => res.request.method == 'DELETE')
			.map(res => res.body);

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
						'data-email': user.email
					}}, ['Delete'])
				])
			])),
		HTTP: remove$,
		remove$,
		removed$
	}
}

// export default UserProfile
export default sources => isolate(UserProfile)(sources)
