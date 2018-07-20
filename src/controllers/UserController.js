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

}

module.exports = UserController;
