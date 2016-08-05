import {div, a, hr} from '@cycle/dom'
import xs from 'xstream'
import classes from 'classes'

import form from 'components/form/styles'

function Welcome (sources) { console.log('welcome')
	let render = () => {
			return div('.welcome', [
				a({props: {href: '/example'}, class: classes(form.submit)}, ['Demo']),
				hr(),
				div('.readme', {props: {
					innerHTML: require('README.md')
				}})
			])
		}

	return {
		DOM: xs.of(render()),
		HTTP: xs.of(null)
	}
}

export default Welcome
