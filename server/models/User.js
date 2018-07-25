import pg from 'pg';

class User {
	constructor() {
		this.pool = new pg.Pool({
			user: process.env.username,
			host: process.env.host,
			database: process.env.database,
			password: process.env.password,
			port: 5432,
		});
		this.pool.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, fullName VARCHAR(40) NOT NULL, email VARCHAR(40) NOT NULL UNIQUE, password VARCHAR(40) NOT NULL, dob DATE NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_DATE, updated_at TIMESTAMP DEFAULT CURRENT_DATE)', () => {
			this.pool.end();
		});
	}
}

module.exports = User;
