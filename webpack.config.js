var webpack = require('webpack'),
	path = require('path'),
	CopyWebpackPlugin = require('copy-webpack-plugin'),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	webpackEnv = require('webpack-env'),
	fs = require('fs');
	nodeExternals = require('webpack-node-externals'),
	externals = nodeExternals({
		whitelist: [/^@cycle\//]
	}),
	commonLoaders = [
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
			loader: "url?limit=10000&mimetype=application/font-woff"
		},
		{
			test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
			loader: "url?limit=10000&mimetype=application/font-woff"
		},
		{
			test: /\.ttf(\?v=\d+\.\d+\.\d+)?/,
			loader: "url?limit=10000&mimetype=application/octet-stream"
		},
		{
			test: /\.eot(\?v=\d+\.\d+\.\d+)?/,
			loader: "file"
		},
		{
			test: /\.svg(\?v=\d+\.\d+\.\d+)?/,
			loader: "url?limit=10000&mimetype=image/svg+xml"
		},
		{
			test: /\.json$/,
			loader: 'json'
		}
	],
	commonPlugins = [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin(webpackEnv.definitions)
    ];

var config = {
    context: path.resolve(process.cwd()),
	devtool: 'source-map',
    module: {
        loaders: commonLoaders
    },
    resolve: {
        modulesDirectories: ['node_modules', 'src/lib', 'src/ui', 'assets'],
        extensions: ['', '.js', '.node', '.less', '.json']
    },
	assets: {}
};

var client = Object.assign({}, config, {
	entry: [
		'./src/client.js',
		'webpack-hot-middleware/client'
	],
	target: 'web',
    output: {
        path: path.resolve(process.cwd(), '.tmp/'),
        publicPath: '/build/',
        filename: 'client.js'
    },
	module: {
		loaders: commonLoaders.concat(
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
	},
	plugins: commonPlugins
});

var server = Object.assign({}, config, {
	target: 'node',
	externals: [externals],
	entry: [
		'./src/server.js'
	],
    output: {
        path: path.resolve(process.cwd(), '.tmp/'),
        publicPath: '/build/',
        filename: 'server.js',
		libraryTarget: 'commonjs2'
    },
	module: {
		loaders: commonLoaders.concat(
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
							exclude: ['**/src/ui/app.js'],
							testExportName: '^[A-Z]|default'
						}]
					]
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
	plugins: commonPlugins.concat(new ExtractTextPlugin("bundle.css")),
	resolve: Object.assign({}, config.resolve, {alias: {
		app: './.tmp/client.js'
	}})
});

module.exports = [client, server];
