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
}

module.exports = EntryController;
