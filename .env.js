var git = require('git-rev-sync');
var path = require('path');

function getBranch() {
	var branch = '';

	try {
		branch = git.branch()
	} catch (e) {
		branch = ''
	}

	return branch
}

var conf = require(path.join(__dirname, 'package.json')),
	version = conf.version,
	env = 'development',
	hostname = typeof (conf.env[env].hostname != 'undefined') ? conf.env[env].hostname : 'localhost',
	port = process.env.PORT || (typeof (conf.env[env].port != 'undefined') ? conf.env[env].port : 1337),
	host = hostname + ':' + port,
	branch = getBranch();

module.exports = {
	BRANCH: branch,
	VERSION: version,
	ENV: env,
	HOSTNAME: hostname,
	PORT: port,
	HOST: host
};
