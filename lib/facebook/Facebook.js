
const request = require('request');
const querystring = require('querystring');

const ROOT_URL = 'https://graph.facebook.com/v3.1/';
function call(urlPath, params) {
	const promise = (resolve, reject) => {
		request(
			{
				url: ROOT_URL + urlPath,
				qs: params
			}, function(err, response, body) {

				if(err) {
					reject(err);
					return;
				}
				let result = '';
				try {
					result = JSON.parse(body);
				} catch(e) {
					result = body;
				}
				resolve(result);
			}
		)
	}
	return new Promise(promise);
}


class Facebook {
	constructor(clientOptions) {
		this.config = {
			clientID: clientOptions.clientId,
			clientSecret: clientOptions.clientSecret
		}
	}

	getAuthUrl(redirectUrl) {
		let url = 'https://www.facebook.com/v3.1/dialog/oauth';
		let params = {
			client_id: this.config.clientID,
			redirect_uri: redirectUrl
		}
		this.redirectUrl = redirectUrl;
		let urlParams = querystring.stringify(params);
		return url + '?' + urlParams;
	}

	isAuth() {
		return !!this.acessToken;
	}

	getAccessToken(code) {
		let urlPath = 'oauth/access_token';
		let params = {
			client_id: this.config.clientID,
			client_secret: this.config.clientSecret,
			redirect_uri: this.redirectUrl,
			grant_type: 'client_credentials'
		};

		const promise = (resolve, reject) => {
			call(urlPath, params)
			.then(result => {
				this.accessToken = result.access_token;
				resolve(this.accessToken);
			})
			.catch(err => {
				reject(err);
			})
		};
		return new Promise(promise);
	}

	getPageFeed(pageId) {
		let urlPath = pageId + '/posts';
		let params = {
			access_token: this.accessToken
		}
		const promise = (resolve, reject) => {
			call(urlPath, params)
			.then(result => {
				resolve(result);
			})
			.catch(err => {
				reject(err);
			})
		};
		return new Promise(promise);
	}
}

module.exports = Facebook;
