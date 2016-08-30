import xs from 'xstream'
import virtualize from 'snabbdom-virtualize/strings'
import {jsdom} from 'jsdom'
import {html, head, body, title, script, link, div} from '@cycle/dom'

const favicons = JSON.parse(require('fs').readFileSync('build/favicons.json').toString()).html

function wrapVTree (vtree) {
	return html([
		head([
			title('HapiCycle'),
			link({attrs: {
				rel: 'stylesheet',
				href: '/build/bundle.css'
			}})
		].concat(favicons.map((html) => virtualize(html, {context: jsdom('<html></html>')})))),
		body([
			div('#app', [vtree]),
			script({attrs: {
				type: 'text/javascript',
				src: '/build/client.js'
			}})
		])
	])
}

function Boilerplate (sources, App) {
	const AppResult = App(sources)

	return Object.assign({}, AppResult, {
		DOM: AppResult.DOM.take(1).map(wrapVTree)
	})
}

export default Boilerplate
