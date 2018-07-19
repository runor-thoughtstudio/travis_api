import express from 'express';

const entriesRouter = express.Router();

entriesRouter.get('/entries', (req, res) => {
	const datastructure = req.app.get('appData');
	if (!datastructure.entries) {
		res.status(404).json({ error: 'Not Found' });
	}
	res.status(200).json(datastructure.entries);
});

export default entriesRouter;
