import chai from 'chai';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Request from '../helpers/requests';
import { mainServer } from '../app';

dotenv.config();
const { expect } = chai;
const request = new Request();
const user = {
	email: 'kamp@gmail.com',
	password: 'password',
	confirmPassword: 'password',
	fullName: 'Kamp Name',
	dateOfBirth: '2018-04-02',
};
const payload = {
	email: 'kampp@gmail.com',
	id: 1,
};
const token = jwt.sign(payload, process.env.secret_token, { expiresIn: 6000 });
const headers = {
	token,
};

describe('User Tests', () => {
	after(() => {
		mainServer.close();
	});
	describe('signupUser()', () => {
		it('should signup a user with correct form details', (done) => {
			process.env.NODE_ENV = 'test';
			const url = `${process.env.root_url}${process.env.version_url}/auth/signup`;
			request.postOrPut('POST', url, user, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(201);
				expect(jsonObject.message).to.be.equal('You have successfully signed up and signed in!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);
	});
});
