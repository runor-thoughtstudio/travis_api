import request from 'request';

export default class Request {
	constructor() {
		this.request = request;
	}

	getOrDelete(method, url, callback) {
		this.request({
			uri: url,
			method,
		}, (error, response, body) => {
			callback(error, response, body);
		});
	}

	postOrPut(method, url, formData, callback) {
		this.request({
			uri: url,
			method,
			form: formData,
		}, (error, response, body) => {
			callback(error, response, body);
		});
	}
}
