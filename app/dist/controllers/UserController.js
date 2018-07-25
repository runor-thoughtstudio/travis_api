'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserController = function () {
	function UserController() {
		_classCallCheck(this, UserController);

		this.dataStructure = '';
	}

	_createClass(UserController, [{
		key: 'signUp',
		value: function signUp(req, res) {
			this.dataStructure = req.app.get('appData');
			var _req$body = req.body,
			    email = _req$body.email,
			    password = _req$body.password,
			    dob = _req$body.dob,
			    fullName = _req$body.fullName;

			if (email === ' ' || dob === ' ' || fullName === ' ' || password === ' ' || password < 6) {
				res.status(422).json({ error: 'Please fill in all the fields properly!' });
			} else if (!email || !dob || !fullName || !password) {
				res.status(400).json({ error: 'Invalid Request!' });
			} else {
				var user = this.dataStructure.users.filter(function (u) {
					return u.email === email.toLowerCase().replace(/\s+/g, '') && u.password === password.toLowerCase();
				});
				if (user.length > 0 && user[0].email) {
					res.status(409).json({ error: 'This email has already been taken!' });
				} else {
					this.dataStructure.users.push(req.body);
					var payload = {
						email: req.body.email
					};
					var token = _jsonwebtoken2.default.sign(payload, '123abcd4', { expiresIn: 60000 });
					res.setHeader('token', token);
					res.status(201).json({ message: 'You have successfully signed up!' });
				}
			}
		}
	}, {
		key: 'signIn',
		value: function signIn(req, res) {
			this.dataStructure = req.app.get('appData');
			var _req$body2 = req.body,
			    email = _req$body2.email,
			    password = _req$body2.password;

			if (email === ' ' || password === ' ' || password < 6) {
				res.status(422).json({ error: 'Please fill in all the fields properly!' });
			} else if (!email || !password) {
				res.status(400).json({ error: 'Invalid Request!' });
			} else {
				var user = this.dataStructure.users.filter(function (u) {
					return u.email === email.toLowerCase().replace(/\s+/g, '') && u.password === password.toLowerCase();
				});
				if (user.length > 0 && user[0].email) {
					var payload = {
						email: user.email
					};
					user = Object.assign({}, user[0]);
					delete user.password;
					var token = _jsonwebtoken2.default.sign(payload, '123abcd45', { expiresIn: 60000 });
					res.setHeader('token', token);
					res.status(200).json({ message: 'You have successfully signed in!', user: user });
				} else {
					res.status(401).json({ error: 'Unauthorized! You are not allowed to log in!' });
				}
			}
		}
	}, {
		key: 'show',
		value: function show(req, res) {
			this.dataStructure = req.app.get('appData');
			if (this.dataStructure.users === undefined || this.dataStructure.users[req.params.id] === undefined) {
				res.status(404).json({ error: 'Not Found! This user does not exist!' });
			} else {
				var user = this.dataStructure.users[req.params.id];
				user = Object.assign({}, user);
				delete user.password;
				res.status(200).json(user);
			}
		}
	}, {
		key: 'update',
		value: function update(req, res) {
			this.dataStructure = req.app.get('appData');
			if (!req.body.email || !req.body.fullName || !req.body.dob) {
				res.status(400).json({ error: 'Invalid Request!' });
			} else if (req.body.email === ' ' || req.body.fullName === ' ' || req.body.dob === ' ') {
				res.status(422).json({ error: 'Please fill in all the fields properly!' });
			} else if (this.dataStructure.users === undefined || this.dataStructure.users[req.params.id] === undefined) {
				res.status(404).json({ error: 'This user does not exist!' });
			} else {
				var data = this.dataStructure;
				data.users[req.params.id].email = req.body.email;
				data.users[req.params.id].fullName = req.body.fullName;
				data.users[req.params.id].dob = req.body.dob;
				res.status(200).json({ message: 'User Profile has been updated!' });
			}
		}
	}, {
		key: 'saveNotification',
		value: function saveNotification(req, res) {
			this.dataStructure = req.app.get('appData');
			if (!req.body.reminderTime) {
				res.status(400).json({ error: 'Invalid request!' });
			} else if (req.body.reminderTime === ' ') {
				res.status(422).json({ error: 'Please pick a date for your notification!' });
			} else if (this.dataStructure.users === undefined || this.dataStructure.users[req.params.id] === undefined) {
				res.status(404).json({ error: 'Not Found! This user does not exist!' });
			} else {
				var data = this.dataStructure;
				data.users[req.params.id].reminderTime = req.body.reminderTime;
				res.status(200).json({ message: 'Your notification settings has been updated!' });
			}
		}
	}]);

	return UserController;
}();

module.exports = UserController;
//# sourceMappingURL=UserController.js.map
