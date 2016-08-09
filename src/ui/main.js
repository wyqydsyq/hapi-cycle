import xs from 'xstream'
import Routes from './routes'

function Main (sources) {
	let routes$ = sources.Router.define(Routes).remember(),
		page$ = routes$.map(({path, value}) => value(sources)).remember().remember()

	return {
		DOM: page$.map(page => page.DOM).flatten(),
		HTTP: page$.map(page => page.HTTP).flatten(),
		Router: page$.map(page => page.Router).flatten()
	}
}

export default Main
