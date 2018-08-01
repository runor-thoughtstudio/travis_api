'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _User2 = require('../models/User');

var _User3 = _interopRequireDefault(_User2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_dotenv2.default.config();

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
				res.status(422).json({
					message: 'Please fill in all the fields properly!',
					status: 'Failed',
					data: []
				});
			} else if (password !== confirmPassword) {
				res.status(401).json({
					message: 'Passwords do not match!',
					status: 'Failed',
					data: []
				});
			} else if (!email || !dateOfBirth || !fullName || !password) {
				res.status(400).json({
					message: 'Bad Request!',
					status: 'Failed',
					data: []
				});
			} else {
				req.body.email = req.body.email.toLowerCase().replace(/\s+/g, '');
				req.body.password = req.body.password.toLowerCase();
				this.create(req, function (error) {
					if (error) {
						res.status(409).json({
							message: error,
							status: 'Failed',
							data: []
						});
					} else {
						res.status(201).json({
							message: 'You have successfully signed up!',
							status: 'Success',
							data: []
						});
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
				res.status(422).json({
					message: 'Please fill in all the fields properly!',
					status: 'Failed',
					data: []
				});
			} else if (!email || !password) {
				res.status(400).json({
					message: 'Bad Request!',
					status: 'Failed',
					data: []
				});
			} else {
				this.loginUser(req, function (err, response) {
					if (err) {
						res.status(500).json({
							message: 'Server Error!',
							status: 'Failed',
							data: []
						});
					} else if (!response.rows || response.rows[0] === undefined) {
						res.status(401).json({
							message: 'Unauthorized! You are not allowed to log in!',
							status: 'Failed',
							data: []
						});
					} else {
						var user = response.rows[0];
						var payload = {
							email: response.rows[0].email,
							id: response.rows[0].id
						};
						user = Object.assign({}, user);
						delete user.password;
						var token = _jsonwebtoken2.default.sign(payload, process.env.secret_token, { expiresIn: 60000 });
						res.status(200).json({
							message: 'You have successfully signed in!',
							status: 'Success',
							data: { user: user, token: token }
						});
					}
				});
			}
		}
	}, {
		key: 'show',
		value: function show(req, res) {
			this.showUser(req, function (err, response) {
				if (err) {
					res.status(400).json({
						message: err,
						status: 'Failed',
						data: []
					});
				} else {
					var user = response.rows[0];
					user = Object.assign({}, user);
					delete user.password;
					res.status(200).json({
						message: 'Retrieved!',
						status: 'Success',
						data: { user: user }
					});
				}
			});
		}
	}, {
		key: 'update',
		value: function update(req, res) {
			if (!req.body.email || !req.body.fullName || !req.body.dateOfBirth) {
				res.status(400).json({
					message: 'Bad Request!',
					status: 'Failed',
					data: []
				});
			} else if (req.body.email === ' ' || req.body.fullName === ' ' || req.body.dateOfBirth === ' ') {
				res.status(422).json({
					message: 'Please fill in all the fields properly!',
					status: 'Failed',
					data: []
				});
			} else {
				this.updateUser(req, function (err) {
					if (err) {
						res.status(400).json({
							message: 'Error! Could not update profile to database!',
							status: 'Failed',
							data: []
						});
					} else {
						res.status(200).json({
							message: 'Your Profile has been updated!',
							status: 'Success',
							data: []
						});
					}
				});
			}
		}
	}, {
		key: 'saveNotification',
		value: function saveNotification(req, res) {
			if (!req.body.reminderTime) {
				res.status(400).json({
					message: 'Bad Request!',
					status: 'Failed',
					data: []
				});
			} else if (req.body.reminderTime === ' ') {
				res.status(422).json({
					message: 'Please pick a date for your notification!',
					status: 'Failed',
					data: []
				});
			} else {
				this.setReminder(req, function (err) {
					if (err) {
						res.status(400).json({
							message: err,
							status: 'Failed',
							data: []
						});
					} else {
						res.status(422).json({
							message: 'Your notification settings has been updated!',
							status: 'Success',
							data: []
						});
					}
				});
			}
		}
	}]);

	return UserController;
}(_User3.default);

exports.default = UserController;
//# sourceMappingURL=UserController.js.map
