import xs from 'xstream'
import {html, head, body, title, script, link, div} from '@cycle/dom'

function wrapApp (appDOM) {
	return html([
		head([
			title('HapiCycle'),
			link({attrs: {
				rel: 'stylesheet',
				href: '/build/bundle.css'
			}})
		]),
		body([
			div('#app', []),
			script({attrs: {
				type: 'text/javascript',
				src: '/build/client.js'
			}})
		])
	])
}

function Boilerplate (sources, App) {
	const AppResult = App(sources)

	let wrappedDOM$ = xs.combine(wrapApp, AppResult.DOM).take(1)

	return Object.assign({}, AppResult, {
		DOM: wrappedDOM$
	})
}

export default Boilerplate
