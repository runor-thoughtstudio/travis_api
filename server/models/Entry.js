import pg from 'pg';
import Joi from 'joi';

class Entry {
	constructor() {
		this.pool = new pg.Pool({
			user: process.env.username,
			host: process.env.host,
			database: process.env.database,
			password: process.env.password,
			port: 5432,
		});
		this.schema = {
			title: Joi.string().min(2),
			description: Joi.string().trim()
				.min(2),
			userId: Joi.number(),
		};
	}

	createEntry(req, callback) {
		const {
			title, description,
		} = req.body;
		const userId = req.userData.id;
		Joi.validate({
			title, description, userId,
		}, this.schema, (err) => {
			if (err) {
				callback(err.details[0].message);
			} else {
				const sql = 'INSERT INTO entries(title, description, user_id) VALUES($1, $2, $3)';
				const values = [title, description, userId];
				this.pool.query(sql, values, (error) => {
					if (error) {
						callback(error.detail);
					} else {
						callback(error);
					}
				});
			}
		});
	}
}

module.exports = Entry;
