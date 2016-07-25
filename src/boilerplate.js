import xs from 'xstream'
import {html, head, body, title, script, link, div} from '@cycle/dom'

function Boilerplate (sources, App) {
	const AppResult = App(sources)

	return Object.assign({}, AppResult, {
		DOM: xs.of(html([
			head([
				title('HapiCycle'),
				link({attrs: {
					rel: 'stylesheet',
					href: '/build/bundle.css'
				}})
			]),
			body([
				div('#app', [AppResult.DOM]),
				script({attrs: {
					type: 'text/javascript',
					src: '/build/client.js'
				}})
			])
		]))
	})
}

export default Boilerplate
