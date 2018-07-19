'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function Request() {
	_classCallCheck(this, Request);

	console.log('entries request initiated');
	this.request = _request2.default;
};

exports.default = Request;
//# sourceMappingURL=requests.js.map
