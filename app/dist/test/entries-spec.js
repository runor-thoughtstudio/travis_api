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
// import nock from 'nock';
var expect = _chai2.default.expect;

var request = new _requests2.default();

describe('Test Entries Routes', function () {
	after(function () {
		_app.mainServer.close();
	});
	describe('allEntries()', function () {
		it('should show all entries in the app', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/entries';
			request.get(url, function (error, res, body) {
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
			request.get(url, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject).to.be.a('object');
				done();
			});
		}).timeout(10000);

		it('should show 404 not found when id doesnt exist', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/entries/10';
			request.get(url, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('This entry cannot be found!');
				done();
			});
		}).timeout(10000);

		it('should show 400 not id is not an integer', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/entries/abc';
			request.get(url, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Bad Request!');
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
			request.post(url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(201);
				expect(jsonObject).to.be.a('object');
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
			request.post(url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Please fill in all the fields properly!');
				done();
			});
		}).timeout(10000);
	});

	describe('updateEntry()', function () {
		it('should update an entry', function (done) {
			var url = process.env.root_url + '/' + process.env.version_url + '/entries/0';
			var formData = {
				title: 'Title',
				description: 'Cool'
			};
			request.put(url, formData, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject).to.be.a('object');
				done();
			});
		}).timeout(10000);
	});
});
//# sourceMappingURL=entries-spec.js.map
