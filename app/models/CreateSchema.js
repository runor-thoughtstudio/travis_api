'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CreateSchema = function () {
	function CreateSchema() {
		_classCallCheck(this, CreateSchema);

		this.pool = new _pg2.default.Pool({
			user: process.env.username,
			host: process.env.host,
			database: process.env.database,
			password: process.env.password,
			port: 5432
		});
	}

	_createClass(CreateSchema, [{
		key: 'createDb',
		value: function createDb() {
			var _this = this;

			this.pool.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, fullName VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, dateOfBirth DATE NOT NULL, reminderTime TIME DEFAULT NULL, created_at TIMESTAMP DEFAULT CURRENT_DATE, updated_at TIMESTAMP DEFAULT CURRENT_DATE)', function () {
				_this.pool.query('CREATE TABLE IF NOT EXISTS entries(id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, user_id INTEGER NOT NULL REFERENCES users, created_at TIMESTAMP DEFAULT CURRENT_DATE, updated_at TIMESTAMP DEFAULT CURRENT_DATE)', function () {
					_this.pool.end();
				});
			});
		}
	}]);

	return CreateSchema;
}();

module.exports = CreateSchema;
//# sourceMappingURL=CreateSchema.js.map
