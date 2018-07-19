import request from 'request';

export default class Request {
	constructor() {
		console.log('entries request initiated');
		this.request = request;
	}

	get(url, callback) {
		this.request({
			uri: url,
			method: 'GET',
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

	delete(url, callback) {
		this.request({
			uri: url,
			method: 'DELETE',
		}, (error, response, body) => {
			callback(error, response, body);
		});
	}
}
