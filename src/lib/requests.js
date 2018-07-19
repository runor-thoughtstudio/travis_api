import request from 'request';

export default class Request {
	constructor() {
		console.log('entries request initiated');
		this.request = request;
	}
}
