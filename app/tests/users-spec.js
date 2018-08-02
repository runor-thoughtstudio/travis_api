'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _requests = require('../helpers/requests');

var _requests2 = _interopRequireDefault(_requests);

var _app = require('../app');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var expect = _chai2.default.expect;

var request = new _requests2.default();
var user = {
	email: 'kamp@gmail.com',
	password: 'password',
	confirmPassword: 'password',
	fullName: 'Kamp Name',
	dateOfBirth: '2018-04-02'
};
var payload = {
	email: 'kampp@gmail.com',
	id: 1
};
var token = _jsonwebtoken2.default.sign(payload, process.env.secret_token, { expiresIn: 6000 });
var headers = {
	token: token
};

describe('User Tests', function () {
	after(function () {
		_app.mainServer.close();
	});
	describe('signupUser()', function () {
		it('should signup a user with correct form details', function (done) {
			process.env.NODE_ENV = 'test';
			var url = '' + process.env.root_url + process.env.version_url + '/auth/signup';
			request.postOrPut('POST', url, user, headers, function (error, res, body) {
				console.log(error);
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(201);
				expect(jsonObject.message).to.be.equal('You have successfully signed up and signed in!');
				expect(jsonObject.status).to.be.equal('Success');
				done();
			});
		}).timeout(30000);
	});
});
//# sourceMappingURL=users-spec.js.map
