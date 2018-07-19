'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function () {
	function Request() {
		_classCallCheck(this, Request);

		console.log('entries request initiated');
		this.request = _request2.default;
	}

	_createClass(Request, [{
		key: 'get',
		value: function get(url, callback) {
			this.request({
				uri: url,
				method: 'GET'
			}, function (error, response, body) {
				callback(error, response, body);
			});
		}
	}, {
		key: 'post',
		value: function post(url, formData, callback) {
			this.request({
				uri: url,
				method: 'POST',
				form: formData
			}, function (error, response, body) {
				callback(error, response, body);
			});
		}
	}]);

	return Request;
}();

exports.default = Request;
//# sourceMappingURL=requests.js.map
