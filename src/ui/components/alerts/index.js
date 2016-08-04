import {div, h4, small} from '@cycle/dom'
import xs from 'xstream'
import delay from 'xstream/extra/delay'
import classes from 'classes'
import {animationEnd} from 'DOMEvents'
import computedStyle from 'computed-style'
import animate from 'styles/animate'

import styles from './styles'

function expiryTimer (alert) {
	return Math.round(alert.expiresAt - Date.now() / 1000)
}

function Alerts ({add$, timeout = 5, DOM}) {
	let transitions = {
			in: [animate.flipInX],
			out: [animate.flipOutX]
		},

		props = {
			class: classes(styles.alerts),
			style: {
				height: '0px',
				transition: 'height .5s ease-in-out',
				transitionDelay: '.5s'
			},
			hook: {
				postpatch: (old, vnode) => vnode.elm.style.height = Array.from(vnode.children).reduce((acc, child) =>
					Number.parseInt(acc)
					+ Number.parseInt(computedStyle(child.elm, 'height'))
					+ Number.parseInt(computedStyle(child.elm, 'marginTop'))
					+ Number.parseInt(computedStyle(child.elm, 'marginBottom'))
				, 0) + 'px'
			}
		},

		// add incoming alerts and set their key & expiry time
		list$ = add$.fold((list, alert) => {
				alert.key = list.length
				alert.expiresAt = Date.now() / 1000 + timeout
				list.push(alert)
				return list
			}, []),

		// filter added alerts to ones that haven't expired
		alerts$ = xs.combine(list$, xs.periodic(250))
			.map(([list]) => list.filter((alert, index) => expiryTimer(alert) > 0))
			.startWith([]),

		// render whatever alerts we're left with
		render = (alerts) => alerts.length
			? div('.alerts', props, alerts.map(alert =>
				div({
					key: alert.key,
					class: classes(styles.alert, styles[alert.className || 'alertInfo']),
					style: {
						animationDuration: '.5s',
						animationDelay: '.5s'
					},
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
						h4([
							(typeof alert.title != 'undefined' && alert.title) ? alert.title : '',
							small({style: {float: 'right'}}, ['Dismissing in ' + expiryTimer(alert) + 's'])
						]),
						alert.text
					])
				)
			)
			: div('.alerts', props, [])

	return {
		DOM: alerts$.map(render)
	}
}

export default Alerts
