import request from 'request';

export default class Request {
	constructor() {
		console.log('entries request initiated');
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

	post(url, formData, callback) {
		this.request({
			uri: url,
			method: 'POST',
			form: formData,
		}, (error, response, body) => {
			callback(error, response, body);
		});
	}

	put(url, formData, callback) {
		this.request({
			uri: url,
			method: 'PUT',
			form: formData,
		}, (error, response, body) => {
			callback(error, response, body);
		});
	}
}
