import xs from 'xstream'
import Routes from './routes'
import WelcomePage from 'pages/welcome'

function App (sources) {
    let routes$ = sources.Router.define(Routes).remember(),
        page$ = routes$.map(({path, value}) => value(Object.assign({}, sources, {
            Router: sources.Router.path(path)
        }))).remember()
	return WelcomePage(sources)
    return {
        DOM: page$.map(page => page.DOM).flatten(),
        HTTP: page$.map(page => page.HTTP).flatten()
    }
}

export default App
