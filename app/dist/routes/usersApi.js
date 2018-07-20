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

	if (email === ' ' || dob === ' ' || fullName === ' ' || password === ' ' || password < 6) {
		res.status(422).json({ error: 'Please fill in all the fields properly!' });
	} else if (!email || !dob || !fullName || !password) {
		res.status(400).json({ error: 'Invalid Request!' });
	} else if (!datastructure.users) {
		res.status(500).json({ error: 'Internal Server Error!' });
	} else {
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
			var token = _jsonwebtoken2.default.sign(payload, '123abcd4', { expiresIn: 60000 });
			res.setHeader('token', token);
			res.status(201).json({ message: 'You have successfully signed up!' });
		}
	}
});

usersRouter.post('/users/signin', function (req, res) {
	var datastructure = req.app.get('appData');
	var _req$body2 = req.body,
	    email = _req$body2.email,
	    password = _req$body2.password;

	if (email === ' ' || password === ' ' || password < 6) {
		res.status(422).json({ error: 'Please fill in all the fields properly!' });
	} else if (!email || !password) {
		res.status(400).json({ error: 'Invalid Request!' });
	} else if (!datastructure.users) {
		res.status(500).json({ error: 'Internal Server Error!' });
	} else {
		var user = datastructure.users.filter(function (u) {
			return u.email === email && u.password === password;
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
});

usersRouter.get('/users/:id', function (req, res) {
	var datastructure = req.app.get('appData');
	if (!datastructure.users) {
		res.status(500).json({ error: 'Internal Server Error!' });
	} else if (datastructure.users === undefined || datastructure.users[req.params.id] === undefined) {
		res.status(404).json({ error: 'Not Found! This user does not exist!' });
	} else {
		var user = datastructure.users[req.params.id];
		user = Object.assign({}, user);
		delete user.password;
		res.status(200).json(user);
	}
});

exports.default = usersRouter;
//# sourceMappingURL=usersApi.js.map
