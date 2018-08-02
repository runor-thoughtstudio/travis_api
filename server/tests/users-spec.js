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
	fullName: 'User Name',
	dateOfBirth: '2018-04-02',
};
const payload = {
	email: 'kamp@gmail.com',
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
			const url = `${process.env.version_url}/auth/signup`;
			request.postOrPut('POST', url, user, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(201);
				expect(jsonObject.message).to.be.equal('You have successfully signed up and signed in!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should validate false on submitting empty field', (done) => {
			const url = `${process.env.version_url}/auth/signup`;
			const tempUser = {
				email: ' ',
				password: 'password',
				confirmPassword: 'password',
				fullName: 'User Name',
				dateOfBirth: '2018-04-02',
			};
			request.postOrPut('POST', url, tempUser, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill all the input fields!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should show error on sending incorrect form data', (done) => {
			const url = `${process.env.version_url}/auth/signup`;
			const tempUser = {
				email: 'user1@example.com',
				password: 'password',
				confirmPassword: 'password',
				username: 'User Name',
				dateOfBirth: '2018-04-02',
			};
			request.postOrPut('POST', url, tempUser, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad Request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('signinUser()', () => {
		it('should signin a user whose email is present', (done) => {
			const url = `${process.env.version_url}/auth/login`;
			const formData = {
				email: 'kamp@gmail.com',
				password: 'password',
			};
			request.postOrPut('POST', url, formData, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('You have signed in successfully!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should validate false on submitting empty field', (done) => {
			const url = `${process.env.version_url}/auth/login`;
			const tempUser = {
				email: ' ',
				password: 'password',
			};
			request.postOrPut('POST', url, tempUser, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill all the input fields!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should show error on sending incorrect form data', (done) => {
			const url = `${process.env.version_url}/auth/login`;
			const tempUser = {
				username: 'user1@example.com',
				password: 'password',
			};
			request.postOrPut('POST', url, tempUser, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad Request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('do not signin user whose email is not present', (done) => {
			const url = `${process.env.version_url}/auth/login`;
			const tempUser = {
				email: 'absentuser1@example.com',
				password: 'password',
			};
			request.postOrPut('POST', url, tempUser, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(401);
				expect(jsonObject.message).to.be.equal('Unauthorized! You are not allowed to log in!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('showProfile()', () => {
		it('should show a users profile who is signed in', (done) => {
			const url = `${process.env.version_url}/user/profile`;
			request.getOrDelete('GET', url, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.not.be.an('Retrieved!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should show error if token is invalid', (done) => {
			const url = `${process.env.version_url}/user/profile`;
			request.getOrDelete('GET', url, 'nnuio', (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(401);
				expect(jsonObject.message).to.be.equal('Unauthorized! You are not allowed to log in!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('UpdateProfile()', () => {
		it('should update a users profile who exists', (done) => {
			const url = `${process.env.version_url}/user/profile`;
			const formData = {
				email: 'mynewemail@gmail.com',
				fullName: 'New User',
				dateOfBirth: '2018-04-02',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('Your Profile has been updated!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);

		it('should validate false on submitting empty field', (done) => {
			const url = `${process.env.version_url}/user/profile`;
			const formData = {
				email: ' ',
				fullName: 'User Name',
				dateOfBirth: '2018-04-02',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill all the input fields!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should show error on sending incorrect form data', (done) => {
			const url = `${process.env.version_url}/user/profile`;
			const formData = {
				email: 'user1@example.com',
				username: 'User Name',
				dateOfBirth: '2018-04-02',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad Request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('saveNotifications()', () => {
		it('should return error when form field is empty', (done) => {
			const url = `${process.env.version_url}/user/notifications`;
			const formData = {
				reminderTime: ' ',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please pick a date for your notification!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should return error when wrong form data is sent', (done) => {
			const url = `${process.env.version_url}/user/notifications`;
			const formData = {
				reminderDay: '10:00',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad Request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});
});
