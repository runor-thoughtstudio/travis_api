import dotenv from 'dotenv';
import Entry from '../models/Entry';

dotenv.config();
class EntryController extends Entry {
	constructor() {
		super();
		this.dataStructure = '';
	}

	index(req, res) {
		this.allEntries(req, (error, response) => {
			if (error) {
				res.status(409).json({ error });
			} else {
				res.status(200).json({
					message: 'Retrieved',
					status: 'Success',
					data: response.rows,
				});
			}
		});
	}

	show(req, res) {
		this.showEntry(req, (error, code, response) => {
			if (error) {
				res.status(code).json({ error });
			} else {
				res.status(200).json(response.rows[0]);
			}
		});
	}

	create(req, res) {
		if (req.body.title === ' ' || req.body.description === ' ') {
			res.status(422).json({ error: 'Please fill in all the fields properly!' });
		} else if (req.body.title && req.body.description) {
			this.createEntry(req, (error) => {
				if (error) {
					res.status(409).json({ error });
				} else {
					res.status(201).json({ message: 'The entry has been created!' });
				}
			});
		} else {
			res.status(400).json({ error: 'Invalid request!' });
		}
	}

	update(req, res) {
		if (req.body.title === ' ' || req.body.description === ' ') {
			res.status(422).json({ error: 'Please fill in all the fields properly!' });
		} else if (req.body.title && req.body.description) {
			this.updateEntry(req, (error, code) => {
				if (error) {
					res.status(code).json({ error });
				} else {
					res.status(200).json({ message: 'This entry has been updated!' });
				}
			});
		} else {
			res.status(400).json({ error: 'Invalid request!' });
		}
	}

	delete(req, res) {
		this.deleteEntry(req, (error) => {
			if (error) {
				res.status(400).json({ error });
			} else {
				res.status(200).json({ message: 'Entry Deleted!' });
			}
		});
	}
}

module.exports = EntryController;
