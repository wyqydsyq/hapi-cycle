import xs from 'xstream'
import Routes from '../routes'

function App (sources) {
    const routes$ = sources.Router.define(Routes),
        page$ = routes$.map(
            ({path, value}) => value(Object.assign({}, sources, {
                Router: sources.Router.path(path)
            }))
        )

    return {
        DOM: page$.map(page => page.DOM).flatten(),
        HTTP: page$.map(page => page.HTTP).flatten()
    }
}

export default App
