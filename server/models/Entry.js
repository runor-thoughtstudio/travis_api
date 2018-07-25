import pg from 'pg';

class Entry {
	constructor() {
		this.pool = new pg.Pool({
			user: process.env.username,
			host: process.env.host,
			database: process.env.database,
			password: process.env.password,
			port: 5432,
		});
		this.pool.query('CREATE TABLE IF NOT EXISTS entries(id SERIAL PRIMARY KEY, title VARCHAR(40) NOT NULL, description TEXT NOT NULL, user_id INTEGER NOT NULL REFERENCES users, created_at TIMESTAMP DEFAULT CURRENT_DATE, updated_at TIMESTAMP DEFAULT CURRENT_DATE)', () => {
			this.pool.end();
		});
	}
}

module.exports = Entry;
