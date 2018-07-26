'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entry = function () {
	function Entry() {
		_classCallCheck(this, Entry);

		this.pool = new _pg2.default.Pool({
			user: process.env.username,
			host: process.env.host,
			database: process.env.database,
			password: process.env.password,
			port: 5432
		});
		this.schema = {
			title: _joi2.default.string().min(2),
			description: _joi2.default.string().trim().min(2),
			userId: _joi2.default.number()
		};
	}

	_createClass(Entry, [{
		key: 'createEntry',
		value: function createEntry(req, callback) {
			var _this = this;

			var _req$body = req.body,
			    title = _req$body.title,
			    description = _req$body.description;

			var userId = req.userData.id;
			_joi2.default.validate({
				title: title, description: description, userId: userId
			}, this.schema, function (err) {
				if (err) {
					callback(err.details[0].message);
				} else {
					var sql = 'INSERT INTO entries(title, description, user_id) VALUES($1, $2, $3)';
					var values = [title, description, userId];
					_this.pool.query(sql, values, function (error) {
						if (error) {
							callback(error.detail);
						} else {
							callback(error);
						}
					});
				}
			});
		}
	}]);

	return Entry;
}();

module.exports = Entry;
//# sourceMappingURL=Entry.js.map
