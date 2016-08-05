import {div, nav, a, i, hr} from '@cycle/dom'
import xs from 'xstream'
import classes from 'classes'

import form from 'components/form/styles'

function Welcome (sources) {
	let render = () => {
			return div('.welcome', [
				nav([
					a({props: {href: '/example'}, class: classes(form.submit)}, ['Demo']),
					a({props: {href: 'https://github.com/wyqydsyq/hapi-cycle', rel: 'external'}, class: classes(form.submit)}, ['GitHub', ' ', i({class: classes(form.fa, form.faGithub)})]),
				]),
				hr(),
				div('.readme', {props: {
					innerHTML: require('README.md')
				}})
			])
		}

	return {
		DOM: xs.of(render())
	}
}

export default Welcome
