import Hapi from 'hapi'
import Webpack from 'webpack'
import WebpackPlugin from 'hapi-webpack-plugin'
import WebpackConfig from '../webpack/webpack-client.config'
import Dogwater from 'dogwater'
import Memory from 'sails-memory'
import path from 'path'
import xs from 'xstream'
import Cycle from '@cycle/xstream-run'
import {makeHTMLDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import {makeRouterDriver} from 'cyclic-router'
import createHistory from 'history/lib/createMemoryHistory'

import App from './ui/main'
import Boilerplate from './boilerplate.js'

import routes from './api/routes'

const server = new Hapi.Server()

server.connection({
	host: HOSTNAME,
	port: PORT
})

let entry = [path.resolve(process.cwd(), 'src/client.js')],
	plugins = WebpackConfig.plugins

if (ENV == 'development') {
	entry.push('webpack-hot-middleware/client')
	plugins.push(new Webpack.HotModuleReplacementPlugin())
}

server.register([
	{
		register: WebpackPlugin,
		options: {
			compiler: new Webpack(Object.assign({}, WebpackConfig, {
				entry,
				plugins
			})),
			assets: {
				path: WebpackConfig.output.path,
				publicPath: WebpackConfig.output.publicPath
			},
			hot: {}
		}
	},
	{
		register: Dogwater,
		options: {
			adapters: {
				memory: Memory
			},
			connections: {
				simple: {
					adapter: 'memory'
				}
			}
		}
	},
	{
		register: require('inert')
	}
], err => {
	if (err) throw err

	// add API routes
	routes.forEach(route => {
		if (typeof route.handler == 'string') {
			route.handler = require('./api/handlers/' + route.handler).default
			route.path = '/api' + route.path
		}

		server.route(route)
	})

	server.route({
		method: 'GET',
		path: '/{route*}',
		handler: (req, res) => {
			const context = createHistory()
			context.replace(req.params.route)

			Cycle.run(sources => Boilerplate(sources, App), {
				DOM: makeHTMLDriver(html => res('<!DOCTYPE html>' + html)),
				HTTP: makeHTTPDriver(),
				Router: makeRouterDriver(context)
			})
		}
	})

	server.route({
		method: 'GET',
		path: '/build/{param*}',
		handler: {
			directory: {
				path: '.tmp'
			}
		}
	})

	server.dogwater({
		identity: 'users',
		connection: 'simple',
		attributes: {
			email: 'string',
			password: 'string',
		}
	})


	server.start(err => {
		if (err) throw err

		console.log('Hapi Started')
	})
})
