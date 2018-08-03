const TwitterApi = require('twitter');


class Twitter {
	constructor(options) {
		this.client = new TwitterApi({
			consumer_key: options.consumerKey,
			consumer_secret: options.consumerSecret,
			access_token_key: options.accessTokenKey,
			access_token_secret: options.accessTokenSecret
		});
	}


	isAuth() {
		return !!this.client;
	}

	getTweets(tag) {
		let params = {
			q: '#' + tag + ' filter:images -filter:nativeretweets',
			count: 100
		};
		const promise = (resolve, reject) =>  {
			this.client.get(
				'search/tweets',
				params,
				function(error, tweets, response) {
					if(error) {
						reject(error);
					}
					resolve(response);
				}
			);
		}
		return new Promise(promise);
	}

}


module.exports = Twitter;
