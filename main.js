/**
 * Export die Lib Klassen
 */
const Instagram = require('./lib/instagram/Instagram');
const Facebook = require('./lib/facebook/Facebook');
const Twitter = require('./lib/twitter/Twitter');

module.exports = {
	Instagram: Instagram,
	Facebook: Facebook,
	Twitter: Twitter
}
