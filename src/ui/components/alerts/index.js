import {div, h4, small} from '@cycle/dom'
import xs from 'xstream'
import delay from 'xstream/extra/delay'
import classes from 'classes'
import {animationEnd} from 'DOMEvents'

import animate from 'styles/animate'
import styles from './styles'

function expiryTimer (alert) {
	return Math.round(alert.expiresAt - Date.now() / 1000)
}

function Alerts ({add$, timeout = 5, DOM}) {
	let transitions = {
			in: [animate.bounceIn],
			out: [animate.bounceOut]
		},

		// add incoming alerts and set their expiry time
		list$ = add$.fold((list, alert) => {
				alert.expiresAt = Date.now() / 1000 + timeout
				list.push(alert)
				return list
			}, []),

		// filter added alerts to ones that haven't expired
		alerts$ = xs.combine(list$, xs.periodic(1000))
			.map(([list]) => list.filter((alert, index) => expiryTimer(alert) > 0))
			.startWith([]),

		// render whatever alerts we're left with
		render = (alerts) => alerts.length
			? div('.alerts', {class: classes(styles.alerts)}, alerts.map((alert, index) =>
				div({
					key: index,
					class: classes(styles.alert, styles[alert.className || 'alertInfo']),
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
							small({style: {float: 'right'}}, ['Expiring in ' + expiryTimer(alert) + 's'])
						]),
						alert.text
					])
				)
			)
			: div('.alerts', {class: classes(styles.alerts)})

	return {
		DOM: alerts$.map(render)
	}
}

export default Alerts
