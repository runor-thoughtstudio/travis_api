import chai from 'chai';
import dotenv from 'dotenv';
import Request from '../lib/requests';
import { mainServer } from '../app';

dotenv.config();
const { expect } = chai;
const request = new Request();
const user = {
	email: 'user1@example.com',
	password: 'password',
	fullName: 'User Name',
	dob: '2018-04',
};

describe('User Tests', () => {
	after(() => {
		mainServer.close();
	});
	describe('signupUser()', () => {
		it('should signup a user with correct form details', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users`;
			request.post(url, user, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(201);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.message).to.be.equal('You have successfully signed up!');
				done();
			});
		}).timeout(10000);

		it('should validate false on submitting empty field', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users`;
			const tempUser = {
				email: ' ',
				password: 'password',
				fullName: 'User Name',
				dob: '2018-04',
			};
			request.post(url, tempUser, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Please fill in all the fields properly!');
				done();
			});
		}).timeout(10000);

		it('should show error on sending incorrect form data', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users`;
			const tempUser = {
				email: 'user1@example.com',
				password: 'password',
				username: 'User Name',
				dob: '2018-04',
			};
			request.post(url, tempUser, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Invalid Request!');
				done();
			});
		}).timeout(10000);

		it('should not allow same email to signup twice', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users`;
			request.post(url, user, (error, res, body) => {
				console.log(`${error}/${res}/${body}`);
			});
			request.post(url, user, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(409);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('This email has already been taken!');
				done();
			});
		}).timeout(10000);
	});

	describe('signinUser()', () => {
		it('should signin a user with correct form data', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/users/signin`;
			const formData = {
				email: 'user1@example.com',
				password: 'password',
			};
			request.post(url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.message).to.be.equal('You have successfully signed in!');
				done();
			});
		}).timeout(10000);
	});
});
