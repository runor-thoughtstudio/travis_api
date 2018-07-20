class EntryController {
	constructor() {
		this.dataStructure = '';
	}

	index(req, res) {
		this.dataStructure = req.app.get('appData');
		if (!this.dataStructure.entries) {
			res.status(500).json({ error: 'Internal Server Error' });
		} else {
			res.status(200).json(this.dataStructure.entries);
		}
	}

	show(req, res) {
		this.dataStructure = req.app.get('appData');
		if (!this.dataStructure.entries) {
			res.status(500).json({ error: 'Internal Server Error!' });
		} else if (!Number.isInteger(Number(req.params.id))) {
			res.status(400).json({ error: 'Bad Request!' });
		} else if
		(this.dataStructure.entries === undefined
			|| this.dataStructure.entries[req.params.id] === undefined) {
			res.status(404).json({ error: 'This entry cannot be found!' });
		} else {
			const entry = this.dataStructure.entries[req.params.id];
			res.status(200).json(entry);
		}
	}

	create(req, res) {
		this.dataStructure = req.app.get('appData');
		if (req.body.title === ' ' || req.body.description === ' ') {
			res.status(422).json({ error: 'Please fill in all the fields properly!' });
		} else if (!this.dataStructure.entries) {
			res.status(500).json({ error: 'Internal Server Error!' });
		} else if (req.body.title && req.body.description) {
			this.dataStructure.entries.push(req.body);
			res.status(201).json({ message: 'The entry has been created!' });
		} else {
			res.status(400).json({ error: 'Invalid request!' });
		}
	}

	update(req, res) {
		this.dataStructure = req.app.get('appData');
		if (req.body.title === ' ' || req.body.description === ' ') {
			res.status(422).json({ error: 'Please fill in all the fields properly!' });
		} else if (!this.dataStructure.entries) {
			res.status(500).json({ error: 'Internal Server Error!' });
		} else if
		(this.dataStructure.entries === undefined
			|| this.dataStructure.entries[req.params.id] === undefined) {
			res.status(404).json({ error: 'This entry does not exist!' });
		} else if (req.body.title && req.body.description) {
			const data = this.dataStructure;
			data.entries[req.params.id].title = req.body.title;
			data.entries[req.params.id].description = req.body.description;
			res.status(200).json({ message: 'This entry has been updated!' });
		} else {
			res.status(400).json({ error: 'Invalid request!' });
		}
	}

	delete(req, res) {
		this.dataStructure = req.app.get('appData');
		if (!this.dataStructure.entries) {
			res.status(500).json({ error: 'Internal Server Error!' });
		} else if
		(this.dataStructure.entries === undefined
			|| this.dataStructure.entries[req.params.id] === undefined) {
			res.status(404).json({ error: 'This entry does not exist!' });
		} else {
			this.dataStructure.entries.splice(req.params.id, 1);
			res.status(204).json();
		}
	}
}

module.exports = EntryController;
