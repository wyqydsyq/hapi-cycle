import {div, a, hr} from '@cycle/dom'
import xs from 'xstream'
import md from 'megamark'
import classes from 'classes'

import styles from 'components/form/styles'

function Welcome (sources) {
	let render = () => {
			return div([
				a({props: {href: '/example'}, class: classes(styles.submit)}, ['Demo']),
				hr(),
				div({props: {
					innerHTML: md(require('README.md'))
				}})
			])
		}

	return {
		DOM: xs.of(render()),
		HTTP: xs.of(null),
		Router: sources.DOM.select('a').events('click').map(ev => {
			ev.preventDefault()
			return ev.target.attributes.href.nodeValue
		})
	}
}

export default Welcome
