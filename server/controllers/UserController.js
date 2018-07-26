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
					res.status(201).json({ message: 'You have successfully signed up!', token });
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
					res.status(200).json({ message: 'You have successfully signed in!', user, token });
				}
			});
		}
	}

	show(req, res) {
		this.dataStructure = req.app.get('appData');
		if (this.dataStructure.users === undefined
			|| this.dataStructure.users[req.params.id] === undefined) {
			res.status(404).json({ error: 'Not Found! This user does not exist!' });
		} else {
			let user = this.dataStructure.users[req.params.id];
			user = Object.assign({}, user);
			delete user.password;
			res.status(200).json(user);
		}
	}

	update(req, res) {
		this.dataStructure = req.app.get('appData');
		if (!req.body.email || !req.body.fullName || !req.body.dob) {
			res.status(400).json({ error: 'Invalid Request!' });
		} else if (req.body.email === ' ' || req.body.fullName === ' ' || req.body.dob === ' ') {
			res.status(422).json({ error: 'Please fill in all the fields properly!' });
		} else if
		(this.dataStructure.users === undefined
			|| this.dataStructure.users[req.params.id] === undefined) {
			res.status(404).json({ error: 'This user does not exist!' });
		} else {
			const data = this.dataStructure;
			data.users[req.params.id].email = req.body.email;
			data.users[req.params.id].fullName = req.body.fullName;
			data.users[req.params.id].dob = req.body.dob;
			res.status(200).json({ message: 'User Profile has been updated!' });
		}
	}

	saveNotification(req, res) {
		this.dataStructure = req.app.get('appData');
		if (!req.body.reminderTime) {
			res.status(400).json({ error: 'Invalid request!' });
		} else if (req.body.reminderTime === ' ') {
			res.status(422).json({ error: 'Please pick a date for your notification!' });
		} else if
		(this.dataStructure.users === undefined
			|| this.dataStructure.users[req.params.id] === undefined) {
			res.status(404).json({ error: 'Not Found! This user does not exist!' });
		} else {
			const data = this.dataStructure;
			data.users[req.params.id].reminderTime = req.body.reminderTime;
			res.status(200).json({ message: 'Your notification settings has been updated!' });
		}
	}
}

module.exports = UserController;
