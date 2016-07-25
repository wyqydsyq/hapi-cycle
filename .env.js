var git = require('git-rev-sync');
var path = require('path');

var version = require(path.join(__dirname, 'package.json')).version;
var branch = git.branch();

module.exports = {
	BRANCH: branch,
	VERSION: version,
	ENV: process.env.NODE_ENV || 'development'
};
