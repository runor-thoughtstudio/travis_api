'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var usersRouter = _express2.default.Router();

usersRouter.post('/users', function (req, res) {
	var datastructure = req.app.get('appData');
	var _req$body = req.body,
	    email = _req$body.email,
	    password = _req$body.password,
	    dob = _req$body.dob,
	    fullName = _req$body.fullName;

	if (email && dob && fullName && password) {
		if (email.length > 0 && dob.length > 0 && fullName.length > 0 && password.length >= 6) {
			var user = datastructure.users.filter(function (u) {
				return u.email === email && u.password === password;
			});
			if (user.length > 0 && user[0].email) {
				res.status(409).json({ error: 'This email has already been taken!' });
			} else {
				datastructure.users.push(req.body);
				var payload = {
					email: req.body.email
				};
				var token = _jsonwebtoken2.default.sign(payload, '1357389', { expiresIn: 60000 });
				res.setHeader('token', token);
				res.status(201).json({ message: 'You have successfully signed up!' });
			}
		} else {
			res.status(422).json({ error: 'Please fill in all the fields properly!' });
		}
	} else {
		res.status(400).json({ error: 'Invalid Request!' });
	}
});

exports.default = usersRouter;
//# sourceMappingURL=usersApi.js.map
