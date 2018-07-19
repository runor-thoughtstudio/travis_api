'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var entriesRouter = _express2.default.Router();

entriesRouter.get('/entries', function (req, res) {
	var datastructure = req.app.get('appData');
	if (!datastructure.entries) {
		res.status(500).json({ error: 'Internal Server Error' });
	} else {
		res.status(200).json(datastructure.entries);
	}
});

entriesRouter.get('/entries/:id', function (req, res) {
	var datastructure = req.app.get('appData');
	if (!datastructure.entries) {
		res.status(500).json({ error: 'Internal Server Error!' });
	} else if (!Number.isInteger(Number(req.params.id))) {
		res.status(400).json({ error: 'Bad Request!' });
	} else if (datastructure.entries === undefined || datastructure.entries[req.params.id] === undefined) {
		res.status(404).json({ error: 'This entry cannot be found!' });
	} else {
		var entry = datastructure.entries[req.params.id];
		res.status(200).json(entry);
	}
});

entriesRouter.post('/entries', function (req, res) {
	var datastructure = req.app.get('appData');
	if (req.body.title === ' ' || req.body.description === ' ') {
		res.status(422).json({ error: 'Please fill in all the fields properly!' });
	} else if (!datastructure.entries) {
		res.status(500).json({ error: 'Internal Server Error!' });
	} else if (req.body.title && req.body.description) {
		datastructure.entries.push(req.body);
		res.status(201).json({ message: 'The entry has been created!' });
	} else {
		res.status(400).json({ error: 'Invalid request!' });
	}
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

exports.default = entriesRouter;
//# sourceMappingURL=entriesApi.js.map
