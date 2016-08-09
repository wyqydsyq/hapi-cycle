import Cycle from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import {makeRouterDriver} from 'cyclic-router';
import {createHistory} from 'history';

let getApp = () => require('./ui/main').default,
	getDrivers = () => ({
		DOM: makeDOMDriver('#app'),
		HTTP: makeHTTPDriver(),
		Router: makeRouterDriver(createHistory()),
		Test: (v) => {console.log(v)}
	}),
	drivers = getDrivers();

window.app = Cycle(getApp(), drivers);
window.dispose = app.run();

if (module.hot) {
	module.hot.accept('./ui/main', () => {
		window.dispose();
		window.app = Cycle(getApp(), drivers);
		window.dispose = window.app.run();
	});
}
