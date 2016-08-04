import {div} from '@cycle/dom'
import xs from 'xstream'

import Layout from 'components/layout'
import Example from 'components/example'

function ExamplePage (sources) {
    let view = Example(sources),
        page = Layout(Object.assign({}, sources, {view}))

    return page
}

export default ExamplePage
