var git = require('git-rev-sync');
var path = require('path');

var conf = require(path.join(__dirname, 'package.json')),
	version = conf.version,
	env = process.env.NODE_ENV || 'development',
	hostname = typeof (conf.env[env].hostname != 'undefined') ? conf.env[env].hostname : 'localhost',
	port = typeof (conf.env[env].port != 'undefined') ? conf.env[env].port : 1337,
	host = hostname + ':' + port,
	branch = git.branch();

module.exports = {
	BRANCH: branch,
	VERSION: version,
	ENV: env,
	HOSTNAME: hostname,
	PORT: port,
	HOST: host
};
