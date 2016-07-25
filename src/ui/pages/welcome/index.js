import {div} from '@cycle/dom';
import xs from 'xstream';

import Layout from 'components/layout';
import Welcome from 'components/welcome';

function WelcomePage (sources) {
    let view = Welcome(sources),
        page = Layout(sources, view);

    return page;
};

export default WelcomePage;
