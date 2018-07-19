import express from 'express';
import jwt from 'jsonwebtoken';

const usersRouter = express.Router();

usersRouter.post('/users', (req, res) => {
	const datastructure = req.app.get('appData');
	const {
		email, password, dob, fullName,
	} = req.body;
	if (email && dob && fullName && password) {
		if (email.length > 0 && dob.length > 0 && fullName.length > 0 && password.length >= 6) {
			const user = datastructure.users.filter(u => u.email === email && u.password === password);
			if (user.length > 0 && user[0].email) {
				res.status(409).json({ error: 'This email has already been taken!' });
			} else {
				datastructure.users.push(req.body);
				const payload = {
					email: req.body.email,
				};
				const token = jwt.sign(payload, '1357389', { expiresIn: 60000 });
				res.setHeader('token', token);
				res.status(201).json({ message: 'You have successfully signed up!' });
			}
		} else {
			res.status(422).json({ message: 'Please fill in all the fields properly!' });
		}
	} else {
		res.status(400).json({ message: 'Invalid Request!' });
	}
});

export default usersRouter;
