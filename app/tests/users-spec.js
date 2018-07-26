'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _requests = require('../helpers/requests');

var _requests2 = _interopRequireDefault(_requests);

var _app = require('../app');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var expect = _chai2.default.expect;

var request = new _requests2.default();
var user = {
	email: 'user1@example.com',
	password: 'password',
	confirmPassword: 'password',
	fullName: 'User Name',
	dob: '2018-04'
};

describe('User Tests', function () {
	after(function () {
		_app.mainServer.close();
	});
	describe('signupUser()', function () {
		it('should signup a user with correct form details', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/auth/signup';
			request.postOrPut('POST', url, user, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(201);
				expect(jsonObject.message).to.be.equal('You have successfully signed up!');
				done();
			});
		}).timeout(10000);

		it('should validate false on submitting empty field', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/auth/signup';
			var tempUser = {
				email: ' ',
				password: 'password',
				confirmPassword: 'password',
				fullName: 'User Name',
				dob: '2018-04'
			};
			request.postOrPut('POST', url, tempUser, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.error).to.be.equal('Please fill in all the fields properly!');
				done();
			});
		}).timeout(10000);

		it('should show error on sending incorrect form data', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/auth/signup';
			var tempUser = {
				email: 'user1@example.com',
				password: 'password',
				confirmPassword: 'password',
				username: 'User Name',
				dob: '2018-04'
			};
			request.postOrPut('POST', url, tempUser, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.error).to.be.equal('Bad Request!');
				done();
			});
		}).timeout(10000);

		it('should not allow same email to signup twice', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/auth/signup';
			request.postOrPut('POST', url, user, function (error, res, body) {
				console.log(error + '/' + res + '/' + body);
			});
			request.postOrPut('POST', url, user, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(409);
				expect(jsonObject.error).to.be.equal('This email has already been taken!');
				done();
			});
		}).timeout(10000);
	});

	describe('signinUser()', function () {
		it('should signin a user whose email is present', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users/signin';
			var formData = {
				email: 'kamp@gmail.com',
				password: 'password'
			};
			request.postOrPut('POST', url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('You have successfully signed in!');
				done();
			});
		}).timeout(10000);

		it('should validate false on submitting empty field', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users/signin';
			var tempUser = {
				email: ' ',
				password: 'password'
			};
			request.postOrPut('POST', url, tempUser, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.error).to.be.equal('Please fill in all the fields properly!');
				done();
			});
		}).timeout(10000);

		it('should show error on sending incorrect form data', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users/signin';
			var tempUser = {
				username: 'user1@example.com',
				password: 'password'
			};
			request.postOrPut('POST', url, tempUser, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.error).to.be.equal('Invalid Request!');
				done();
			});
		}).timeout(10000);

		it('do not signin user whose email is not present', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users/signin';
			var tempUser = {
				email: 'absentuser1@example.com',
				password: 'password'
			};
			request.postOrPut('POST', url, tempUser, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(401);
				expect(jsonObject.error).to.be.equal('Unauthorized! You are not allowed to log in!');
				done();
			});
		}).timeout(10000);
	});

	describe('showProfile()', function () {
		it('should show a users profile whose id is valid', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users/0';
			request.getOrDelete('GET', url, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.email).to.not.be.an('undefined');
				expect(jsonObject.fullName).to.not.be.an('undefined');
				done();
			});
		}).timeout(10000);

		it('should show error if user id is invalid', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users/10';
			request.getOrDelete('GET', url, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject.error).to.be.equal('Not Found! This user does not exist!');
				expect(jsonObject.title).to.be.an('undefined');
				expect(jsonObject.description).to.be.an('undefined');
				done();
			});
		}).timeout(10000);
	});

	describe('UpdateProfile()', function () {
		it('should update a users profile who exists', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users/0';
			var formData = {
				email: 'mynewemail@gmail.com',
				fullName: 'New User',
				dob: '2018-04'
			};
			request.postOrPut('PUT', url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('User Profile has been updated!');
				done();
			});
		}).timeout(10000);

		it('should return error for user who does not exist', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users/10';
			var formData = {
				email: 'mynewemail@gmail.com',
				fullName: 'New User',
				dob: '2018-04'
			};
			request.postOrPut('PUT', url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject.error).to.be.equal('This user does not exist!');
				done();
			});
		}).timeout(10000);

		it('should validate false on submitting empty field', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users/0';
			var formData = {
				email: ' ',
				fullName: 'User Name',
				dob: '2018-04'
			};
			request.postOrPut('PUT', url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.error).to.be.equal('Please fill in all the fields properly!');
				done();
			});
		}).timeout(10000);

		it('should show error on sending incorrect form data', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users/0';
			var formData = {
				email: 'user1@example.com',
				username: 'User Name',
				dob: '2018-04'
			};
			request.postOrPut('PUT', url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.error).to.be.equal('Invalid Request!');
				done();
			});
		}).timeout(10000);
	});

	describe('saveNotifications()', function () {
		it('should save notifications when user and form data are correct', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users/0/notifications';
			var formData = {
				reminderTime: '10:00'
			};
			request.postOrPut('PUT', url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('Your notification settings has been updated!');
				done();
			});
		}).timeout(10000);

		it('should return error when form field is empty', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users/0/notifications';
			var formData = {
				reminderTime: ' '
			};
			request.postOrPut('PUT', url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.error).to.be.equal('Please pick a date for your notification!');
				done();
			});
		}).timeout(10000);

		it('should return error when wrong form data is sent', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users/0/notifications';
			var formData = {
				reminderDay: '10:00'
			};
			request.postOrPut('PUT', url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.error).to.be.equal('Invalid request!');
				done();
			});
		}).timeout(10000);

		it('should return error on trying to update user that does not exist', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users/10/notifications';
			var formData = {
				reminderTime: '10:00'
			};
			request.postOrPut('PUT', url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject.error).to.be.equal('Not Found! This user does not exist!');
				done();
			});
		}).timeout(10000);
	});
});
//# sourceMappingURL=users-spec.js.map
