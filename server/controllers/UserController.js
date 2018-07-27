import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';


dotenv.config();
class UserController extends User {
	constructor() {
		super();
		this.dataStructure = '';
	}

	signUp(req, res) {
		const {
			email, password, confirmPassword, dateOfBirth, fullName,
		} = req.body;
		if (email === ' ' || dateOfBirth === ' ' || fullName === ' ' || password === ' ' || password.length < 6) {
			res.status(422).json({ error: 'Please fill in all the fields properly!' });
		} else if (password !== confirmPassword) {
			res.status(401).json({ error: 'Passwords do not match!' });
		} else if (!email || !dateOfBirth || !fullName || !password) {
			res.status(400).json({ error: 'Bad Request!' });
		} else {
			req.body.email = req.body.email.toLowerCase().replace(/\s+/g, '');
			req.body.password = req.body.password.toLowerCase();
			this.create(req, (error) => {
				if (error) {
					res.status(409).json({ error });
				} else {
					const payload = {
						email: req.body.email,
					};
					const token = jwt.sign(payload, process.env.secret_token, { expiresIn: 60000 });
					res.setHeader('token', token);
					res.status(201).json({ message: 'You have successfully signed up!' });
				}
			});
		}
	}

	signIn(req, res) {
		const { email, password } = req.body;
		if (email === ' ' || password === ' ' || password < 6) {
			res.status(422).json({ error: 'Please fill in all the fields properly!' });
		} else if (!email || !password) {
			res.status(400).json({ error: 'Bad Request!' });
		} else {
			this.loginUser(req, (err, response) => {
				if (err) {
					res.status(500).json({ error: 'Server Error!' });
				} else if (!response.rows || response.rows[0] === undefined) {
					res.status(401).json({ error: 'Unauthorized! You are not allowed to log in!' });
				} else {
					let user = response.rows[0];
					const payload = {
						email: response.rows[0].email,
						id: response.rows[0].id,
					};
					user = Object.assign({}, user);
					delete user.password;
					const token = jwt.sign(payload, process.env.secret_token, { expiresIn: 60000 });
					res.setHeader('token', token);
					res.status(200).json({ message: 'You have successfully signed in!', user });
				}
			});
		}
	}

	show(req, res) {
		this.showUser(req, (err, response) => {
			if (err) {
				res.status(400).json({ error: err });
			} else {
				let user = response.rows[0];
				user = Object.assign({}, user);
				delete user.password;
				res.status(200).json(user);
			}
		});
	}

	update(req, res) {
		if (!req.body.email || !req.body.fullName || !req.body.dateOfBirth) {
			res.status(400).json({ error: 'Bad Request!' });
		} else if (req.body.email === ' ' || req.body.fullName === ' ' || req.body.dateOfBirth === ' ') {
			res.status(422).json({ error: 'Please fill in all the fields properly!' });
		} else {
			this.updateUser(req, (err) => {
				if (err) {
					res.status(400).json({ error: 'Error! Could not update profile to database' });
				} else {
					res.status(200).json({ message: 'Your Profile has been updated!' });
				}
			});
		}
	}

	saveNotification(req, res) {
		if (!req.body.reminderTime) {
			res.status(400).json({ error: 'Bad request!' });
		} else if (req.body.reminderTime === ' ') {
			res.status(422).json({ error: 'Please pick a date for your notification!' });
		} else {
			this.setReminder(req, (err) => {
				if (err) {
					res.status(400).json({ error: err });
				} else {
					res.status(200).json({ message: 'Your notification settings has been updated!' });
				}
			});
		}
	}
}

module.exports = UserController;
