import {div, header, footer, nav, img, small, span, h1} from '@cycle/dom'
import xs from 'xstream'
import classes from 'classes'

import styles from './styles'

const layout = ({DOM, view}) => {
	let externalLinkClick$ = DOM.select('a[rel="external"]').events('click').map(ev => {
			ev.target.target = '_blank';
			return view;
		}),
		render = (content) => {
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
			DOM: view.DOM.map(render)
		})

	return component
};

export default layout
