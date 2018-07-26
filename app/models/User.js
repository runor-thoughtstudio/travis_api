'use strict';

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function User() {
	var _this = this;

	_classCallCheck(this, User);

	this.pool = new _pg2.default.Pool({
		user: process.env.username,
		host: process.env.host,
		database: process.env.database,
		password: process.env.password,
		port: 5432
	});
	this.pool.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, fullName VARCHAR(40) NOT NULL, email VARCHAR(40) NOT NULL UNIQUE, password VARCHAR(40) NOT NULL, dob DATE NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_DATE, updated_at TIMESTAMP DEFAULT CURRENT_DATE)', function () {
		_this.pool.end();
	});
};

module.exports = User;
//# sourceMappingURL=User.js.map
