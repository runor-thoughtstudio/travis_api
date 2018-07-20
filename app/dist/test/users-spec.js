'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _requests = require('../lib/requests');

var _requests2 = _interopRequireDefault(_requests);

var _app = require('../app');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var expect = _chai2.default.expect;

var request = new _requests2.default();
var user = {
	email: 'user1@example.com',
	password: 'password',
	fullName: 'User Name',
	dob: '2018-04'
};

describe('User Tests', function () {
	after(function () {
		_app.mainServer.close();
	});
	describe('signupUser()', function () {
		it('should signup a user with correct form details', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users';
			request.post(url, user, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(201);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.message).to.be.equal('You have successfully signed up!');
				done();
			});
		}).timeout(10000);

		it('should validate false on submitting empty field', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users';
			var tempUser = {
				email: ' ',
				password: 'password',
				fullName: 'User Name',
				dob: '2018-04'
			};
			request.post(url, tempUser, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Please fill in all the fields properly!');
				done();
			});
		}).timeout(10000);

		it('should show error on sending incorrect form data', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users';
			var tempUser = {
				email: 'user1@example.com',
				password: 'password',
				username: 'User Name',
				dob: '2018-04'
			};
			request.post(url, tempUser, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Invalid Request!');
				done();
			});
		}).timeout(10000);

		it('should not allow same email to signup twice', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users';
			request.post(url, user, function (error, res, body) {
				console.log(error + '/' + res + '/' + body);
			});
			request.post(url, user, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(409);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('This email has already been taken!');
				done();
			});
		}).timeout(10000);
	});

	describe('signinUser()', function () {
		it('should signin a user whose email is present', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users/signin';
			var formData = {
				email: 'user1@example.com',
				password: 'password'
			};
			request.post(url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject).to.be.a('object');
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
			request.post(url, tempUser, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject).to.be.a('object');
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
			request.post(url, tempUser, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject).to.be.a('object');
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
			request.post(url, tempUser, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(401);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Unauthorized! You are not allowed to log in!');
				done();
			});
		}).timeout(10000);
	});

	describe('showProfile()', function () {
		it('should show a users profile whose id is valid', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/users/0';
			request.get(url, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject).to.be.a('object');
				done();
			});
		}).timeout(10000);
	});
});
//# sourceMappingURL=users-spec.js.map
