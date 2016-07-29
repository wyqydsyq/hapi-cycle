import Cycle from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import {makeRouterDriver} from 'cyclic-router';
import {createHistory} from 'history';

let getApp = () => require('./ui/app').default,
	getDrivers = () => ({
	    DOM: makeDOMDriver('#app'),
	    HTTP: makeHTTPDriver(),
		Router: makeRouterDriver(createHistory())
	}),
	drivers = getDrivers();

window.app = Cycle(getApp(), drivers);
window.dispose = app.run();

if (module.hot) {
	module.hot.accept('./ui/app', () => {
		window.dispose();
		window.app = Cycle(getApp(), drivers);
		window.dispose = window.app.run();
	});
}
