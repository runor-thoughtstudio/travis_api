import chai from 'chai';
import dotenv from 'dotenv';
// import jwt from 'jsonwebtoken';
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
// const payload = {
// 	email: 'kampp@gmail.com',
// 	id: 1,
// };
const token = null;
// const token = jwt.sign(payload, process.env.secret_token, { expiresIn: 6000 });
const headers = {
	token,
};

describe('User Tests', () => {
	after(() => {
		mainServer.close();
	});
	describe('auth()', () => {
		it('should signup a user with correct form details', (done) => {
			// process.env.NODE_ENV = 'test';
			const url = `${process.env.root_url}${process.env.version_url}/auth/signup`;
			request.postOrPut('POST', url, user, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(201);
				expect(jsonObject.message).to.be.equal('You have successfully signed up and signed in!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should signin user', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/auth/login`;
			const formData = {
				email: 'kamp@gmail.com',
				password: 'password',
			};
			request.postOrPut('POST', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				headers.token = jsonObject.user.token;
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('You have signed in successfully!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);
	});

	describe('showProfile()', () => {
		it('should show a users profile who is signed in', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/user/profile`;
			request.getOrDelete('GET', url, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.not.be.an('Retrieved!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should show error if token is invalid', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/user/profile`;
			request.getOrDelete('GET', url, 'nnuio', (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(401);
				expect(jsonObject.message).to.be.equal('Unauthorized! You are not allowed to log in!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});
});
