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
	User.signUp(req, res);
});

usersRouter.post('/users/signin', function (req, res) {
	User.signIn(req, res);
});

usersRouter.get('/users/:id', function (req, res) {
	User.show(req, res);
});

usersRouter.put('/users/:id', function (req, res) {
	User.update(req, res);
});

usersRouter.put('/users/:id/notifications', function (req, res) {
	User.saveNotification(req, res);
});

exports.default = usersRouter;
//# sourceMappingURL=usersApi.js.map
