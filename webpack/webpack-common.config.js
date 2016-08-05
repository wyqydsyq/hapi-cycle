var webpack = require('webpack'),
	path = require('path'),
	copyWebpackPlugin = require('copy-webpack-plugin'),
	webpackEnv = require('webpack-env'),
	env = webpackEnv.definitions.ENV;

module.exports = {
	context: path.resolve(process.cwd()),
	devtool: 'source-map',
	assets: {},
	alias: {
		'README.md': path.resolve(process.cwd(), 'README.md')
	},
	resolve: {
		modulesDirectories: ['node_modules', 'src/lib', 'src/ui', 'assets', './'],
		extensions: ['', '.js', '.node', '.less', '.json', '.md']
	},
	module: {
		loaders: [
			{
				test: /\.node$/,
				loader: 'node'
			},
			{
				test: /\.jpe?g$|\.gif$|\.png$|\.wav$|\.mp3$/,
				loader: 'url?limit=100000'
			},
			{
				test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/font-woff'
			},
			{
				test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/font-woff'
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?/,
				loader: 'url?limit=10000&mimetype=application/octet-stream'
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?/,
				loader: 'file'
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?/,
				loader: 'url?limit=10000&mimetype=image/svg+xml'
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.md$/,
				loader: 'html!markdown'
			}
		]
	},
	plugins: [
		(env == 'development') ? new webpack.HotModuleReplacementPlugin() : () => {},
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin(webpackEnv.definitions)//,
		// new webpack.optimize.CommonsChunkPlugin('common.[hash].js')
	]
}
