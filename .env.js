var git = require('git-rev-sync');
var path = require('path');

var conf = require(path.join(__dirname, 'package.json')),
	version = conf.version,
	hostname = conf.hostname,
	port = conf.port,
	host = hostname + ':' + port,
	branch = git.branch();

module.exports = {
	BRANCH: branch,
	VERSION: version,
	ENV: process.env.NODE_ENV || 'development',
	HOSTNAME: hostname,
	PORT: port,
	HOST: host
};
