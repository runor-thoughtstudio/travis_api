import express from 'express';
import EntryController from '../controllers/EntryController';

const entriesRouter = express.Router();
const Entry = new EntryController();

entriesRouter.get('/entries', (req, res) => {
	Entry.index(req, res);
});

entriesRouter.get('/entries/:id', (req, res) => {
	Entry.show(req, res);
});

entriesRouter.post('/entries', (req, res) => {
	Entry.create(req, res);
});

entriesRouter.put('/entries/:id', (req, res) => {
	Entry.update(req, res);
});

entriesRouter.delete('/entries/:id', (req, res) => {
	const datastructure = req.app.get('appData');
	if (!datastructure.entries) {
		res.status(500).json({ error: 'Internal Server Error!' });
	} else if
	(datastructure.entries === undefined || datastructure.entries[req.params.id] === undefined) {
		res.status(404).json({ error: 'This entry does not exist!' });
	} else {
		datastructure.entries.splice(req.params.id, 1);
		res.status(204).json();
	}
});


export default entriesRouter;
