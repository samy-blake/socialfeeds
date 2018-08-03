/**
 * Express app example
 */

/* ┌──────────────────────────────────┐
 *   EXTERNAL - LIBS
 * └──────────────────────────────────┘
 */
require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
var exphbs = require('express-handlebars');

/* ┌──────────────────────────────────┐
 *   INTERNAL - LIBS
 * └──────────────────────────────────┘
 */

const socialfeeds = require('../main');
const Instagram = socialfeeds.Instagram;
const instagram = new Instagram({
	clientId: process.env.INSTA_CLIENT_ID,
	clientSecret: process.env.INSTA_CLIENT_SECRET
});
const Facebook = socialfeeds.Facebook;
const facebook = new Facebook({
	clientId: process.env.FACEBOOK_CLIENT_ID,
	clientSecret: process.env.FACEBOOK_CLIENT_SECRET
});
const Twitter = socialfeeds.Twitter;
const twitter = new Twitter({
	consumerKey: process.env.TWITTER_CONSUMER_KEY,
	consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
	accessTokenKey: process.env.TWITTER_ACCESS_TOKEN_KEY,
	accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/* ┌──────────────────────────────────┐
 *   HANDLEBARS
 * └──────────────────────────────────┘
 */

var hbs = exphbs.create({
	extname: 'hbs',
  partialsDir: path.join(__dirname, 'views/partials')
  // helpers: require(path.join(__dirname, 'views/helpers/combined'))
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


/* ┌──────────────────────────────────┐
 *   ROUTES
 * └──────────────────────────────────┘
 */
var online = {
	instagram: false,
	facebook: false,
	twitter: true
};

app.get('/', function(req, res) {
	res.render('index.hbs', {
		online: online
	});
});

/* ┌──────────────────────────────────┐
 *   Instagram
 * └──────────────────────────────────┘
 */

app.get('/instagram-auth', function(req, res) {
	const redirectUrl = process.env.HOST_URL + req.originalUrl + '/token';
	res.redirect(instagram.getAuthUrl(redirectUrl));
});

app.get('/instagram-auth/token', function(req, res) {
	instagram.getAccessToken(req.query.code)
	.then(accessToken => {
		online.instagram = true;
		res.redirect('/');
	})
	.catch(err => {
		console.error(err);
		res.send(err);
	});
});
app.get('/instagram', function(req, res) {
	instagram.getTagMediaRecent('airbeatone2018')
	.then(medias => {
		res.send(medias);
	})
	.catch(err => {
		res.send(err);
	});
});


/* ┌──────────────────────────────────┐
 *   FACEBOOK
 * └──────────────────────────────────┘
 */
app.get('/facebook-auth', function(req, res) {
	const redirectUrl = process.env.HOST_URL + req.originalUrl + '/token';
	res.redirect(facebook.getAuthUrl(redirectUrl));
});
app.get('/facebook-auth/token', function(req, res) {
	facebook.getAccessToken(req.query.code)
	.then(accessToken => {
		console.log('facebook accesstoken:', accessToken);

		online.facebook = true;
		res.redirect('/');
	})
	.catch(err => {
		res.send(err);
	});
});

app.get('/facebook', function(req, res) {
	// res.render('facebook.hbs');
	facebook.getPageFeed(104135996332394)
	.then(result => {
		res.send(result);
	})
});

/* ┌──────────────────────────────────┐
 *   TWITTER
 * └──────────────────────────────────┘
 */

app.get('/twitter', function(req, res) {
	twitter.getTweets('hannoverliebe')
	.then(result => {
		res.send(result);
	})
	.catch(err => {
		res.send(err);
	});

});

app




app.listen(3000, function() {
	console.log('open http://localhost:3000');
});
