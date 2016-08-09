import xs from 'xstream'
import Routes from './routes'

function Main (sources) { console.log('main')
    let routes$ = sources.Router.define(Routes),
        page$ = routes$.map(({path, value}) => value(sources)).remember()

    return {
        DOM: page$.map(page => page.DOM).flatten().remember(),
        HTTP: page$.map(page => page.HTTP).flatten().remember(),
        Router: page$.map(page => page.Router).flatten().remember()
    }
}

export default Main
