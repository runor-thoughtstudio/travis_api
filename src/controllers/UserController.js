import jwt from 'jsonwebtoken';

class UserController {
	constructor() {
		this.dataStructure = '';
	}

	signup(req, res) {
		this.dataStructure = req.app.get('appData');
		const {
			email, password, dob, fullName,
		} = req.body;
		if (email === ' ' || dob === ' ' || fullName === ' ' || password === ' ' || password < 6) {
			res.status(422).json({ error: 'Please fill in all the fields properly!' });
		} else if (!email || !dob || !fullName || !password) {
			res.status(400).json({ error: 'Invalid Request!' });
		} else if (!this.dataStructure.users) {
			res.status(500).json({ error: 'Internal Server Error!' });
		} else {
			const user = this.dataStructure.users.filter(u => u.email === email
				&& u.password === password);
			if (user.length > 0 && user[0].email) {
				res.status(409).json({ error: 'This email has already been taken!' });
			} else {
				this.dataStructure.users.push(req.body);
				const payload = {
					email: req.body.email,
				};
				const token = jwt.sign(payload, '123abcd4', { expiresIn: 60000 });
				res.setHeader('token', token);
				res.status(201).json({ message: 'You have successfully signed up!' });
			}
		}
	}

	signin(req, res) {
		this.dataStructure = req.app.get('appData');
		const { email, password } = req.body;
		if (email === ' ' || password === ' ' || password < 6) {
			res.status(422).json({ error: 'Please fill in all the fields properly!' });
		} else if (!email || !password) {
			res.status(400).json({ error: 'Invalid Request!' });
		} else if (!this.dataStructure.users) {
			res.status(500).json({ error: 'Internal Server Error!' });
		} else {
			let user = this.dataStructure.users.filter(u => u.email === email && u.password === password);
			if (user.length > 0 && user[0].email) {
				const payload = {
					email: user.email,
				};
				user = Object.assign({}, user[0]);
				delete user.password;
				const token = jwt.sign(payload, '123abcd45', { expiresIn: 60000 });
				res.setHeader('token', token);
				res.status(200).json({ message: 'You have successfully signed in!', user });
			} else {
				res.status(401).json({ error: 'Unauthorized! You are not allowed to log in!' });
			}
		}
	}

	show(req, res) {
		this.dataStructure = req.app.get('appData');
		if (!this.dataStructure.users) {
			res.status(500).json({ error: 'Internal Server Error!' });
		} else if
		(this.dataStructure.users === undefined
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
		} else if (!this.dataStructure.users) {
			res.status(500).json({ error: 'Internal Server Error!' });
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
}

module.exports = UserController;
