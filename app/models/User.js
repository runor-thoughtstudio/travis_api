'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_dotenv2.default.config();

var User = function () {
	function User() {
		_classCallCheck(this, User);

		this.pool = new _pg2.default.Pool({
			user: process.env.username,
			host: process.env.host,
			database: process.env.database,
			password: process.env.password,
			port: 5432
		});
	}

	_createClass(User, [{
		key: 'create',
		value: function create(req, callback) {
			var _req$body = req.body,
			    email = _req$body.email,
			    fullName = _req$body.fullName,
			    password = _req$body.password,
			    dob = _req$body.dob;

			var sql = 'INSERT INTO users(fullName, email, password, dob) VALUES($1, $2, $3, $4)';
			var values = [fullName, email, password, dob];
			this.pool.query(sql, values, function (error) {
				if (error) {
					callback(error.detail);
				} else {
					callback(error);
				}
			});
		}
	}]);

	return User;
}();

module.exports = User;
//# sourceMappingURL=User.js.map
