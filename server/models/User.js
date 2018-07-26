import pg from 'pg';
import Joi from 'joi';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
class User {
	constructor() {
		this.pool = new pg.Pool({
			user: process.env.username,
			host: process.env.host,
			database: process.env.database,
			password: process.env.password,
			port: 5432,
		});
		this.schema = {
			email: Joi.string().email().uppercase().trim(),
			password: Joi.string().trim()
				.min(6),
			confirmPassword: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).uppercase().trim()
				.min(6),
			fullName: Joi.string(),
			dob: Joi.string(),
		};
	}

	create(req, callback) {
		const {
			email, fullName, password, dob,
		} = req.body;
		Joi.validate({
			email, password, fullName, dob,
		}, this.schema, (err) => {
			if (err) {
				callback(err.details[0].message);
			} else {
				const saltRounds = 10;
				const salt = bcryptjs.genSaltSync(saltRounds);
				const hash = bcryptjs.hashSync(password, salt);
				const sql = 'INSERT INTO users(fullName, email, password, dob) VALUES($1, $2, $3, $4)';
				const values = [fullName, email, hash, dob];
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

module.exports = User;