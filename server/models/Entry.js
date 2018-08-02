import pg from 'pg';
import Joi from 'joi';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();
class Entry {
	constructor() {
		if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
			this.connectionString = process.env.DATABASE_URL;
		} else if (process.env.NODE_ENV === 'test') {
			this.connectionString = process.env.test_DATABASE_URL;
		}
		this.pool = new pg.Pool({
			connectionString: this.connectionString,
		});
		this.schema = {
			title: Joi.string().min(2),
			description: Joi.string().trim()
				.min(2),
			userId: Joi.number(),
		};
	}

	allEntries(req, callback) {
		const userId = req.userData.id;
		const sql = 'SELECT * FROM entries WHERE user_id=$1';
		const values = [userId];
		this.pool.query(sql, values, (error, res) => {
			if (error) {
				callback(error.detail, res);
			} else {
				callback(error, res);
			}
		});
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
				console.log(err);
				console.log('am creating');
				const sql = 'INSERT INTO entries(title, description, user_id) VALUES($1, $2, $3)';
				const values = [title, description, userId];
				this.pool.query(sql, values, (error) => {
					if (error) {
						callback(error);
					} else {
						callback(error);
					}
				});
			}
		});
	}

	showEntry(req, callback) {
		const userId = req.userData.id;
		const sql = 'SELECT * FROM entries WHERE id=$1';
		const values = [req.params.id];
		this.pool.query(sql, values, (error, response) => {
			if (error) {
				callback(error, 400, false);
			} else {
				const res = response;
				if (response.rows.length >= 1) {
					if (res.rows[0].user_id === userId) {
						callback(error, 200, res);
					} else {
						callback('You do not have permission to view this entry!', 403, false);
					}
				} else {
					callback('No entry found!', 404, false);
				}
			}
		});
	}

	updateEntry(req, callback) {
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
				const sql = 'SELECT * FROM entries WHERE id=$1';
				const values = [req.params.id];
				this.pool.query(sql, values, (error, response) => {
					if (error) {
						callback(error.detail, 400);
					} else if (response.rows.length < 1) {
						callback('This entry does not exist!', 404);
					} else if (!error) {
						if (response.rows[0].user_id === userId) {
							const time = Date.now();
							const timeCreated = moment(response.rows[0].created_at).format('X');
							const timeNow = moment().format('X');
							const diff = (timeNow - timeCreated) / 86400;
							if (diff <= 1) {
								const updateSql = 'UPDATE entries SET title=$1, description=$2 WHERE id=$3';
								const updateValues = [title, description, req.params.id];
								this.pool.query(updateSql, updateValues, (updateError) => {
									callback(updateError, 200);
								});
							} else if (time !== response.rows[0].created_at) {
								callback('This entry is old and can no longer be updated!', 403);
							}
						} else if (response.rows[0].user_id !== userId) {
							callback('You do not have permission to edit this entry!', 403);
						}
					}
				});
			}
		});
	}

	deleteEntry(req, callback) {
		const userId = req.userData.id;
		const sql = 'SELECT * FROM entries WHERE id=$1 AND user_id=$2';
		const values = [req.params.id, userId];
		this.pool.query(sql, values, (error, response) => {
			if (error) {
				callback(error);
			} else {
				const res = response;
				if (res.rows.length >= 1) {
					const deleteSql = 'DELETE FROM entries WHERE id=$1';
					const deleteValues = [req.params.id];
					this.pool.query(deleteSql, deleteValues, (deleteError) => {
						callback(deleteError);
					});
				} else {
					callback('This entry does not exist or you do not have permission to delete it!');
				}
			}
		});
	}
}

export default Entry;
