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
	describe('signup user()', function () {
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
	});
});
//# sourceMappingURL=users-spec.js.map
