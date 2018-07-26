'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _User2 = require('../models/User');

var _User3 = _interopRequireDefault(_User2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserController = function (_User) {
	_inherits(UserController, _User);

	function UserController() {
		_classCallCheck(this, UserController);

		var _this = _possibleConstructorReturn(this, (UserController.__proto__ || Object.getPrototypeOf(UserController)).call(this));

		_this.dataStructure = '';
		return _this;
	}

	_createClass(UserController, [{
		key: 'signUp',
		value: function signUp(req, res) {
			var _req$body = req.body,
			    email = _req$body.email,
			    password = _req$body.password,
			    confirmPassword = _req$body.confirmPassword,
			    dateOfBirth = _req$body.dateOfBirth,
			    fullName = _req$body.fullName;

			if (email === ' ' || dateOfBirth === ' ' || fullName === ' ' || password === ' ' || password.length < 6) {
				res.status(422).json({ error: 'Please fill in all the fields properly!' });
			} else if (password !== confirmPassword) {
				res.status(401).json({ error: 'Passwords do not match!' });
			} else if (!email || !dateOfBirth || !fullName || !password) {
				res.status(400).json({ error: 'Bad Request!' });
			} else {
				var payload = {
					email: req.body.email
				};
				req.body.email = req.body.email.toLowerCase().replace(/\s+/g, '');
				req.body.password = req.body.password.toLowerCase();
				this.create(req, function (error) {
					if (error) {
						res.status(409).json({ error: error });
					} else {
						var token = _jsonwebtoken2.default.sign(payload, '123abcd4', { expiresIn: 60000 });
						res.status(201).json({ message: 'You have successfully signed up!', token: token });
					}
				});
			}
		}
	}, {
		key: 'signIn',
		value: function signIn(req, res) {
			var _req$body2 = req.body,
			    email = _req$body2.email,
			    password = _req$body2.password;

			if (email === ' ' || password === ' ' || password < 6) {
				res.status(422).json({ error: 'Please fill in all the fields properly!' });
			} else if (!email || !password) {
				res.status(400).json({ error: 'Bad Request!' });
			} else {
				this.loginUser(req, function (err, response) {
					if (err) {
						res.status(500).json({ error: 'Server Error!' });
					} else if (!response.rows || response.rows[0] === undefined) {
						res.status(401).json({ error: 'Unauthorized! You are not allowed to log in!' });
					} else {
						var user = response.rows[0];
						var payload = {
							email: user.email
						};
						user = Object.assign({}, user);
						delete user.password;
						var token = _jsonwebtoken2.default.sign(payload, '123abcd45', { expiresIn: 60000 });
						res.setHeader('token', token);
						res.status(200).json({ message: 'You have successfully signed in!', user: user, token: token });
					}
				});
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
}(_User3.default);

module.exports = UserController;
//# sourceMappingURL=UserController.js.map
