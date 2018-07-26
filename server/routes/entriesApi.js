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
	Entry.delete(req, res);
});


export default entriesRouter;
