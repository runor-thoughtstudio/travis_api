'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _EntryController = require('../controllers/EntryController');

var _EntryController2 = _interopRequireDefault(_EntryController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var entriesRouter = _express2.default.Router();
var Entry = new _EntryController2.default();

entriesRouter.get('/entries', function (req, res) {
	Entry.index(req, res);
});

entriesRouter.get('/entries/:id', function (req, res) {
	Entry.show(req, res);
});

entriesRouter.post('/entries', function (req, res) {
	Entry.create(req, res);
});

entriesRouter.put('/entries/:id', function (req, res) {
	var datastructure = req.app.get('appData');
	if (req.body.title === ' ' || req.body.description === ' ') {
		res.status(422).json({ error: 'Please fill in all the fields properly!' });
	} else if (!datastructure.entries) {
		res.status(500).json({ error: 'Internal Server Error!' });
	} else if (datastructure.entries === undefined || datastructure.entries[req.params.id] === undefined) {
		res.status(404).json({ error: 'This entry does not exist!' });
	} else if (req.body.title && req.body.description) {
		datastructure.entries[req.params.id].title = req.body.title;
		datastructure.entries[req.params.id].description = req.body.description;
		res.status(200).json({ message: 'This entry has been updated!' });
	} else {
		res.status(400).json({ error: 'Invalid request!' });
	}
});

entriesRouter.delete('/entries/:id', function (req, res) {
	var datastructure = req.app.get('appData');
	if (!datastructure.entries) {
		res.status(500).json({ error: 'Internal Server Error!' });
	} else if (datastructure.entries === undefined || datastructure.entries[req.params.id] === undefined) {
		res.status(404).json({ error: 'This entry does not exist!' });
	} else {
		datastructure.entries.splice(req.params.id, 1);
		res.status(204).json();
	}
});

exports.default = entriesRouter;
//# sourceMappingURL=entriesApi.js.map
