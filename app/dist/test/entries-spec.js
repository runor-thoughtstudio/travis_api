'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _requests = require('../lib/requests');

var _requests2 = _interopRequireDefault(_requests);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import nock from 'nock';
_dotenv2.default.config();
var expect = _chai2.default.expect;

var request = new _requests2.default();

describe('Test Entries Routes', function () {
	describe('allEntries()', function () {
		it('should show all entries in the app', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/entries';
			request.getOrDelete('GET', url, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject).to.be.a('array');
				done();
			});
		}).timeout(10000);
	});

	describe('showEntry()', function () {
		it('should show an entry when the id exists', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/entries/0';
			request.getOrDelete('GET', url, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.title).to.not.be.an('undefined');
				expect(jsonObject.description).to.not.be.an('undefined');
				done();
			});
		}).timeout(10000);

		it('should show 404 not found when id doesnt exist', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/entries/10';
			request.getOrDelete('GET', url, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject.error).to.be.equal('This entry cannot be found!');
				expect(jsonObject.title).to.be.an('undefined');
				expect(jsonObject.description).to.be.an('undefined');
				done();
			});
		}).timeout(10000);
	});

	describe('createEntry()', function () {
		it('should create an entry when form data is correct', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/entries';
			var formData = {
				title: 'New Title',
				description: 'New Description'
			};
			request.postOrPut('POST', url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(201);
				expect(jsonObject.message).to.be.equal('The entry has been created!');
				done();
			});
		}).timeout(10000);

		it('validation should fail when any form field is empty', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/entries';
			var formData = {
				title: ' ',
				description: 'New Description'
			};
			request.postOrPut('POST', url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.error).to.be.equal('Please fill in all the fields properly!');
				done();
			});
		}).timeout(10000);

		it('should give error on sending incorrect form data', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/entries';
			var formData = {
				name: ' ',
				body: 'New Description'
			};
			request.postOrPut('POST', url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.error).to.be.equal('Invalid request!');
				done();
			});
		}).timeout(10000);
	});

	describe('updateEntry()', function () {
		it('should update an entry on correct form data', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/entries/0';
			var formData = {
				title: 'Title',
				description: 'Cool'
			};
			request.postOrPut('PUT', url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('This entry has been updated!');
				done();
			});
		}).timeout(10000);

		it('validation should fail when any form field is empty', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/entries/0';
			var formData = {
				title: ' ',
				description: 'Cool'
			};
			request.postOrPut('PUT', url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.error).to.be.equal('Please fill in all the fields properly!');
				done();
			});
		}).timeout(10000);

		it('show error 404 when id does not exist', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/entries/10';
			var formData = {
				title: 'First Title',
				description: 'Cool'
			};
			request.postOrPut('PUT', url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject.error).to.be.equal('This entry does not exist!');
				done();
			});
		}).timeout(10000);

		it('should give error when incorrect form data is sent', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/entries/0';
			var formData = {
				name: 'First Title',
				body: 'Cool'
			};
			request.postOrPut('PUT', url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.error).to.be.equal('Invalid request!');
				done();
			});
		}).timeout(10000);
	});

	describe('deleteEntry()', function () {
		it('should delete an entry when id exists', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/entries/0';
			request.getOrDelete('DELETE', url, function (error, res, body) {
				expect(res.statusCode).to.be.equal(204);
				expect(body).to.be.equal('');
				done();
			});
		}).timeout(10000);

		it('should show error when id doesnt exist', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/entries/10';
			request.getOrDelete('DELETE', url, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject.error).to.be.equal('This entry does not exist!');
				done();
			});
		}).timeout(10000);
	});
});
//# sourceMappingURL=entries-spec.js.map
