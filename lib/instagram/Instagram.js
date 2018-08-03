const instagram = require('instagram-node').instagram();

class Instagram {
	/**
	 *
	 * @param {client_id, client_secret} clientOptions
	 */
	constructor(clientOptions) {
		this.instagram = instagram;

		this.instagram.use({
			client_id: clientOptions.clientId,
			client_secret: clientOptions.clientSecret
		});

		this.authScope = ['basic', 'public_content', 'comments'];
	}

	isAuth() {
		return !!this.acessToken;
	}

	getAuthUrl(redirectUrl) {
		this.redirectUrl = redirectUrl;
		return this.instagram.get_authorization_url(redirectUrl, {
			scope: this.authScope
		})
	}

	getAccessToken(code) {
		const promise = (resolve, reject) => {
			this.instagram.authorize_user(
				code,
				this.redirectUrl,
				(err, result) => {

					if(err) {
						reject(err);
						return;
					}
					this.acessToken = result.access_token;
					this.instagram.use({
						access_token: result.access_token
					});
					resolve(result.access_token);

				}
			);
		};
		return new Promise(promise);
	}

	getTagMediaRecent(tag) {
		const promise = (resolve, reject) => {
			this.instagram.tag_media_recent(
				tag,
				(err, medias, pagination, remaining, limit) => {
					if(err) {
						reject(err);
						return;
					}
					resolve(medias);
				}
			);
		};

		return new Promise(promise);
	}
}


module.exports = Instagram;
