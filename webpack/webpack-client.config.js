var common = require('./webpack-common.config'),
	path = require('path');

module.exports = Object.assign({}, common, {
	entry: ['./src/client.js'],
	target: 'web',
	output: {
		path: path.resolve(process.cwd(), '../build/'),
		publicPath: '/build/',
		filename: 'client.js'
	},
	module: {
		loaders: common.module.loaders.concat(
			{
				test: /\.js$/,
				exclude: /(node_modules|\.tmp|webpack)/,
				loader: 'babel',
				query: {
					presets: ['es2015','es2016'],
					sourceMaps: 'inline',
					plugins: [
						['cycle-hmr/xstream', {
							include: ['**/src/ui/**.js'],
							testExportName: '^[A-Z]|default'
						}]
					]
				}
			},
			{
				test: /\.less$|\.css$/,
				loader: 'style!css?camelCase&minimize&discardDuplicates&-import&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less'
			}
		)
	}
});
