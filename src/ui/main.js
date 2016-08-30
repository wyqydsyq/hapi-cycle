import xs from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import Routes from './routes'

function routedComponent (sources) {
	return ({path, value}) => value(Object.assign({}, sources, {Router: sources.Router.path(path)}))
}

function Main (sources) {
	let routes$ = sources.Router.define(Routes).compose(dropRepeats((a, b) => a.path == b.path)),
		page$ = routes$.map(routedComponent(sources)).remember()

	return {
		DOM: page$.map(page => page.DOM).flatten(),
		HTTP: page$.map(page => page.HTTP).flatten(),
		Router: page$.map(page => page.Router).flatten()
	}
}

export default Main
