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
			request.get(url, function (error, res, body) {
				var jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject).to.be.a('array');
				done();
			});
		}).timeout(10000);
	});
});
//# sourceMappingURL=entries-spec.js.map
