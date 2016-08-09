import {div, button, img, strong} from '@cycle/dom'
import xs from 'xstream'
import MD5 from 'crypto-js/md5'
import {animationEnd} from 'DOMEvents'
import normalizeHTTPErrors from 'normalizeHTTPErrors'
import animate from 'styles/animate'
import classes from 'classes'

import styles from './styles.less'

function UserProfile ({DOM, HTTP, user$}) {
	let transitions = {
			in: [animate.flipInX],
			out: [animate.flipOutX]
		},
		remove$ = DOM.select('button').events('click').map(ev => ({
				url: '/api/users',
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
			div({
				class: classes(styles.userProfile),
				hook: {
					insert: (vnode) => {
						vnode.elm.classList.add(...[...transitions.in, animate.animated])
						return vnode
					},
					remove: (vnode, removeElm) => {
						animationEnd.split(' ').map(ended => vnode.elm.addEventListener(ended, removeElm, false))

						vnode.elm.classList.remove(...transitions.in)
						vnode.elm.classList.add(...transitions.out)
						return vnode
					}
				}
			}, [
				div({class: classes(styles.userGravatar)}, [img({
					attrs: {
						src: 'https://www.gravatar.com/avatar/' + MD5(user.email.toLowerCase().trim())
					},
					style: {
						height: '100px'
					}
				})]),
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

export default UserProfile
