import pg from 'pg';
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
	}

	create(req, callback) {
		const {
			email, fullName, password, dob,
		} = req.body;
		const sql = 'INSERT INTO users(fullName, email, password, dob) VALUES($1, $2, $3, $4)';
		const values = [fullName, email, password, dob];
		this.pool.query(sql, values, (error) => {
			if (error) {
				callback(error.detail);
			} else {
				callback(error);
			}
		});
	}
}

module.exports = User;
