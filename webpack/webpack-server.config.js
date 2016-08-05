var common = require('./webpack-common.config'),
	webpack = require('webpack'),
	path = require('path'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	nodeExternals = require('webpack-node-externals'),
	externals = nodeExternals({
		whitelist: [/^@cycle\//]
	}),
	webpackEnv = require('webpack-env'),
	babelPlugins = [];

if (webpackEnv.definitions.ENV == 'development') {
	babelPlugins.push(['cycle-hmr/xstream', {
		include: ['**/src/ui/**.js'],
		exclude: ['**/src/ui/main.js'],
		testExportName: '^[A-Z]|default'
	}])
}

module.exports = Object.assign({}, common, {
	target: 'node',
	entry: ['./src/server.js'],
	output: {
		path: path.resolve(process.cwd(), 'build/'),
		publicPath: '/build/',
		filename: 'server.js',
		libraryTarget: 'commonjs2'
	},
	externals: [externals],
	module: {
		loaders: common.module.loaders.concat(
			{
				test: /\.js$/,
				exclude: /(node_modules|webpack)/,
				loader: 'babel',
				query: {
					presets: ['es2015','es2016'],
					sourceMaps: 'inline',
					plugins: babelPlugins
				}

			},
			{
				test: /\.less$|\.css$/,
				loader: ExtractTextPlugin.extract([
					'css?camelCase&minimize&discardDuplicates&-import&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
					'less'
				])
			}
		)
	},
	plugins: common.plugins.concat(new ExtractTextPlugin('bundle.css')),
	resolve: Object.assign({}, common.resolve, {alias: {
		main: './build/client.js'
	}})
});
