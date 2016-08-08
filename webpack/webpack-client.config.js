var common = require('./webpack-common.config'),
	path = require('path'),
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
	target: 'web',
	entry: ['./src/client.js'],
	output: {
		path: path.resolve(process.cwd(), 'build/'),
		publicPath: '/build/',
		filename: 'client.js'
	},
	module: {
		loaders: common.module.loaders.concat(
			{
				test: /\.js$/,
				exclude: /(node_modules|build|webpack)/,
				loader: 'babel',
				query: {
					presets: ['es2015','es2016'],
					sourceMaps: 'inline',
					plugins: babelPlugins
				}
			},
			{
				test: /\.less$|\.css$/,
				loader: 'style!css?camelCase&minimize&discardDuplicates&-import&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less'
			}
		)
	}
});
