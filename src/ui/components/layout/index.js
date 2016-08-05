import {div, header, footer, small, span, h1} from '@cycle/dom'
import xs from 'xstream'
import classes from 'classes'

import styles from './styles'

const layout = ({DOM, view}) => {
	let externalLinkClick$ = DOM.select('a[rel="external"]').events('click').map(ev => {
			ev.target.target = '_blank';
			return null
		}).startWith(null),
		render = ([content]) => {
			return div([
				header([
					h1('HapiCycle')
				]),
				div({class: classes(styles.page)}, [
					content
				]),
				footer({class: classes(styles.container)}, [
					small([
						'© ' + new Date().getFullYear() + ' YourApp ',
						span({class: classes(styles.pullRight)}, `v${VERSION}-${BRANCH} (${ENV})`)
					])
				])
			])
		},
		component = Object.assign({}, view, {
			DOM: xs.combine(view.DOM, externalLinkClick$).map(render),
			HTTP: view.HTTP || xs.of(null),
			Router: DOM.select('a').events('click').filter(ev => ev.target.attributes.href.textContent.match(/^\/.*/)).map(ev => {
				ev.preventDefault()
				return ev.target.attributes.href.nodeValue
			})
		})

	return component
};

export default layout
