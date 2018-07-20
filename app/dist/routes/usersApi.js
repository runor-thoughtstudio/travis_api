'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _UserController = require('../controllers/UserController');

var _UserController2 = _interopRequireDefault(_UserController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var usersRouter = _express2.default.Router();
var User = new _UserController2.default();

usersRouter.post('/users', function (req, res) {
	User.signup(req, res);
});

usersRouter.post('/users/signin', function (req, res) {
	User.signin(req, res);
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

usersRouter.put('/users/:id', function (req, res) {
	var datastructure = req.app.get('appData');
	if (!req.body.email || !req.body.fullName || !req.body.dob) {
		res.status(400).json({ error: 'Invalid Request!' });
	} else if (req.body.email === ' ' || req.body.fullName === ' ' || req.body.dob === ' ') {
		res.status(422).json({ error: 'Please fill in all the fields properly!' });
	} else if (!datastructure.users) {
		res.status(500).json({ error: 'Internal Server Error!' });
	} else if (datastructure.users === undefined || datastructure.users[req.params.id] === undefined) {
		res.status(404).json({ error: 'This user does not exist!' });
	} else {
		datastructure.users[req.params.id].email = req.body.email;
		datastructure.users[req.params.id].fullName = req.body.fullName;
		datastructure.users[req.params.id].dob = req.body.dob;
		res.status(200).json({ message: 'User Profile has been updated!' });
	}
});

usersRouter.put('/users/:id/notifications', function (req, res) {
	var datastructure = req.app.get('appData');
	if (!req.body.reminderTime) {
		res.status(400).json({ error: 'Invalid request!' });
	} else if (req.body.reminderTime === ' ') {
		res.status(422).json({ error: 'Please pick a date for your notification!' });
	} else if (!datastructure.users) {
		res.status(500).json({ error: 'Internal Server Error!' });
	} else if (datastructure.users === undefined || datastructure.users[req.params.id] === undefined) {
		res.status(404).json({ error: 'Not Found! This user does not exist!' });
	} else {
		datastructure.users[req.params.id].reminderTime = req.body.reminderTime;
		res.status(200).json({ message: 'Your notification settings has been updated!' });
	}
});

exports.default = usersRouter;
//# sourceMappingURL=usersApi.js.map
