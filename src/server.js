import Hapi from 'hapi'
import Webpack from 'webpack'
import WebpackPlugin from 'hapi-webpack-plugin'
import WebpackConfig from '../webpack.config.js'
import Dogwater from 'dogwater'
import Memory from 'sails-memory'
import path from 'path'
import xs from 'xstream'
import Cycle from '@cycle/xstream-run'
import {makeHTMLDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import {makeRouterDriver} from 'cyclic-router'
import createHistory from 'history/lib/createMemoryHistory'

import App from './ui/app'
import Boilerplate from './boilerplate.js'

const server = new Hapi.Server()

server.connection({
	host: 'localhost',
	port: 1337
});

server.register([
	{
		register: WebpackPlugin,
		options: {
			compiler: new Webpack(Object.assign({}, WebpackConfig[0], {
				entry: [
					path.resolve(process.cwd(), 'src/client.js'),
					'webpack-hot-middleware/client'
				]
			})),
			assets: {
				path: WebpackConfig[0].output.path,
				publicPath: WebpackConfig[0].output.publicPath
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

	server.route({
		method: 'GET',
		path: '/{route*}',
		handler: (req, res) => {
			const context = createHistory()
			context.replace(req.url)

			Cycle.run(sources => Boilerplate(sources, App), {
				DOM: makeHTMLDriver(html => res('<!DOCTYPE html>' + html), {transposition: true}),
				HTTP: makeHTTPDriver(),
				Router: makeRouterDriver(context)
			});
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

	server.route({
	    method: 'POST',
	    path: '/users',
	    handler: (req, res) => {
			const Users = server.collections().users

			Users.create([{
				email: req.payload.email,
				password: req.payload.password,
			}]).then(user => res(user))
		}
	})

	server.route({
	    method: 'GET',
	    path: '/users',
	    handler: (req, res) => {
			const Users = server.collections().users

			Users.find().then(users => {
				return res(users)
			})
		}
	})


	server.start(err => {
		if (err) throw err

		console.log('Hapi Started')
	})
})
