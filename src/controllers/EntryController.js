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
}

module.exports = EntryController;
