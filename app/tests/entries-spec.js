'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _requests = require('../helpers/requests');

var _requests2 = _interopRequireDefault(_requests);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
// import nock from 'nock';
var expect = _chai2.default.expect;

var request = new _requests2.default();
var payload = {
	email: 'kamp@gmail.com',
	id: 1
};
var token = _jsonwebtoken2.default.sign(payload, process.env.secret_token, { expiresIn: 6000 });
var headers = {
	token: token
};

describe('Test Entries Routes', function () {
	describe('createEntry()', function () {
		it('validation should fail when any form field is empty', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries';
			var formData = {
				title: ' ',
				description: 'New Description'
			};
			request.postOrPut('POST', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill in all the fields properly!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(10000);

		it('should give error on sending incorrect form data', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries';
			var formData = {
				name: ' ',
				body: 'New Description'
			};
			request.postOrPut('POST', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(10000);
	});

	describe('updateEntry()', function () {
		it('validation should fail when any form field is empty', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries/4';
			var formData = {
				title: ' ',
				description: 'Cool'
			};
			request.postOrPut('PUT', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill in all the fields properly!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(10000);

		it('show error 404 when id does not exist', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries/0';
			var formData = {
				title: 'First Title',
				description: 'Cool'
			};
			request.postOrPut('PUT', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject.message).to.be.equal('This entry does not exist!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(10000);

		it('should give error when incorrect form data is sent', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries/4';
			var formData = {
				name: 'First Title',
				body: 'Cool'
			};
			request.postOrPut('PUT', url, formData, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(10000);
	});

	describe('showEntry()', function () {
		it('should show 404 not found when id doesnt exist', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries/0';
			request.getOrDelete('GET', url, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject.error).to.be.equal('No entry found!');
				expect(jsonObject.title).to.be.an('undefined');
				expect(jsonObject.description).to.be.an('undefined');
				done();
			});
		}).timeout(10000);
	});

	describe('allEntries()', function () {
		it('should show all entries in the app', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries';
			request.getOrDelete('GET', url, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.message).to.be.equal('Retrieved');
				expect(jsonObject.data).to.be.a('array');
				done();
			});
		}).timeout(10000);
	});

	describe('deleteEntry()', function () {
		it('should show error when id doesnt exist', function (done) {
			var url = '' + process.env.root_url + process.env.version_url + '/entries/0';
			request.getOrDelete('DELETE', url, headers, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('This entry does not exist or you do not have permission to delete it!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(10000);
	});
});
//# sourceMappingURL=entries-spec.js.map
