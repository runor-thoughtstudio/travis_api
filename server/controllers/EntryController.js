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
				res.status(409).json({
					message: error,
					status: 'Failed',
					data: [],
				});
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
				res.status(code).json({
					message: error,
					status: 'Failed',
					data: [],
				});
			} else {
				res.status(200).json({
					message: 'Retrieved',
					status: 'Success',
					data: response.rows[0],
				});
			}
		});
	}

	create(req, res) {
		if (req.body.title === ' ' || req.body.description === ' ') {
			res.status(422).json({
				message: 'Please fill all the input fields!',
				status: 'Failed',
				data: [],
			});
			console.log(req.body);
			console.log(req.body.title);
			console.log(req.body.description);
		} else if (req.body.title && req.body.description) {
			this.createEntry(req, (error) => {
				console.log(error);
				if (error) {
					res.status(409).json({
						message: error,
						status: 'Failed',
						data: { error },
					});
				} else {
					res.status(201).json({
						message: 'Entry has been created!',
						status: 'Success',
						data: [],
					});
				}
			});
		} else {
			res.status(400).json({
				message: 'Bad request!',
				status: 'Failed',
				data: [],
			});
		}
	}

	update(req, res) {
		if (req.body.title === ' ' || req.body.description === ' ') {
			res.status(422).json({
				message: 'Please fill all the input fields!',
				status: 'Failed',
				data: [],
			});
		} else if (req.body.title && req.body.description) {
			this.updateEntry(req, (error, code) => {
				if (error) {
					res.status(code).json({
						message: error,
						status: 'Failed',
						data: [],
					});
				} else {
					res.status(200).json({
						message: 'This entry has been updated!',
						status: 'Success',
						data: [],
					});
				}
			});
		} else {
			res.status(400).json({
				message: 'Bad request!',
				status: 'Failed',
				data: [],
			});
		}
	}

	delete(req, res) {
		this.deleteEntry(req, (error) => {
			if (error) {
				res.status(400).json({
					message: error,
					status: 'Failed',
					data: [],
				});
			} else {
				res.status(204).json({
					message: 'Entry Deleted!',
					status: 'Success',
					data: [],
				});
			}
		});
	}
}

export default EntryController;
