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
			res.status(422).json({
				message: 'Please fill in all the fields properly!',
				status: 'Failed',
				data: [],
			});
		} else if (password !== confirmPassword) {
			res.status(401).json({
				message: 'Passwords do not match!',
				status: 'Failed',
				data: [],
			});
		} else if (!email || !dateOfBirth || !fullName || !password) {
			res.status(400).json({
				message: 'Bad Request!',
				status: 'Failed',
				data: [],
			});
		} else {
			req.body.email = req.body.email.toLowerCase().replace(/\s+/g, '');
			req.body.password = req.body.password.toLowerCase();
			this.create(req, (error) => {
				if (error) {
					res.status(409).json({
						message: error,
						status: 'Failed',
						data: [],
					});
				} else {
					res.status(201).json({
						message: 'You have successfully signed up!',
						status: 'Success',
						data: [],
					});
				}
			});
		}
	}

	signIn(req, res) {
		const { email, password } = req.body;
		if (email === ' ' || password === ' ' || password < 6) {
			res.status(422).json({
				message: 'Please fill in all the fields properly!',
				status: 'Failed',
				data: [],
			});
		} else if (!email || !password) {
			res.status(400).json({
				message: 'Bad Request!',
				status: 'Failed',
				data: [],
			});
		} else {
			this.loginUser(req, (err, response) => {
				if (err) {
					res.status(500).json({
						message: 'Server Error!',
						status: 'Failed',
						data: [],
					});
				} else if (!response.rows || response.rows[0] === undefined) {
					res.status(401).json({
						message: 'Unauthorized! You are not allowed to log in!',
						status: 'Failed',
						data: [],
					});
				} else {
					let user = response.rows[0];
					const payload = {
						email: response.rows[0].email,
						id: response.rows[0].id,
					};
					user = Object.assign({}, user);
					delete user.password;
					const token = jwt.sign(payload, process.env.secret_token, { expiresIn: 60000 });
					res.status(200).json({
						message: 'You have successfully signed in!',
						status: 'Success',
						data: { user, token },
					});
				}
			});
		}
	}

	show(req, res) {
		this.showUser(req, (err, response) => {
			if (err) {
				res.status(400).json({
					message: err,
					status: 'Failed',
					data: [],
				});
			} else {
				let user = response.rows[0];
				user = Object.assign({}, user);
				delete user.password;
				res.status(200).json({
					message: 'Retrieved!',
					status: 'Success',
					data: { user },
				});
			}
		});
	}

	update(req, res) {
		if (!req.body.email || !req.body.fullName || !req.body.dateOfBirth) {
			res.status(400).json({
				message: 'Bad Request!',
				status: 'Failed',
				data: [],
			});
		} else if (req.body.email === ' ' || req.body.fullName === ' ' || req.body.dateOfBirth === ' ') {
			res.status(422).json({
				message: 'Please fill in all the fields properly!',
				status: 'Failed',
				data: [],
			});
		} else {
			this.updateUser(req, (err) => {
				if (err) {
					res.status(400).json({
						message: 'Error! Could not update profile to database!',
						status: 'Failed',
						data: [],
					});
				} else {
					res.status(200).json({
						message: 'Your Profile has been updated!',
						status: 'Success',
						data: [],
					});
				}
			});
		}
	}

	saveNotification(req, res) {
		if (!req.body.reminderTime) {
			res.status(400).json({
				message: 'Bad Request!',
				status: 'Failed',
				data: [],
			});
		} else if (req.body.reminderTime === ' ') {
			res.status(422).json({
				message: 'Please pick a date for your notification!',
				status: 'Failed',
				data: [],
			});
		} else {
			this.setReminder(req, (err) => {
				if (err) {
					res.status(400).json({
						message: err,
						status: 'Failed',
						data: [],
					});
				} else {
					res.status(422).json({
						message: 'Your notification settings has been updated!',
						status: 'Success',
						data: [],
					});
				}
			});
		}
	}
}

module.exports = UserController;
