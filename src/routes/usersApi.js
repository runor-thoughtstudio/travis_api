import express from 'express';
import UserController from '../controllers/UserController';

const usersRouter = express.Router();
const User = new UserController();

usersRouter.post('/users', (req, res) => {
	User.signup(req, res);
});

usersRouter.post('/users/signin', (req, res) => {
	const datastructure = req.app.get('appData');
	const { email, password } = req.body;
	if (email === ' ' || password === ' ' || password < 6) {
		res.status(422).json({ error: 'Please fill in all the fields properly!' });
	} else if (!email || !password) {
		res.status(400).json({ error: 'Invalid Request!' });
	} else if (!datastructure.users) {
		res.status(500).json({ error: 'Internal Server Error!' });
	} else {
		let user = datastructure.users.filter(u => u.email === email && u.password === password);
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
});

usersRouter.get('/users/:id', (req, res) => {
	const datastructure = req.app.get('appData');
	if (!datastructure.users) {
		res.status(500).json({ error: 'Internal Server Error!' });
	} else if
	(datastructure.users === undefined || datastructure.users[req.params.id] === undefined) {
		res.status(404).json({ error: 'Not Found! This user does not exist!' });
	} else {
		let user = datastructure.users[req.params.id];
		user = Object.assign({}, user);
		delete user.password;
		res.status(200).json(user);
	}
});

usersRouter.put('/users/:id', (req, res) => {
	const datastructure = req.app.get('appData');
	if (!req.body.email || !req.body.fullName || !req.body.dob) {
		res.status(400).json({ error: 'Invalid Request!' });
	} else if (req.body.email === ' ' || req.body.fullName === ' ' || req.body.dob === ' ') {
		res.status(422).json({ error: 'Please fill in all the fields properly!' });
	} else if (!datastructure.users) {
		res.status(500).json({ error: 'Internal Server Error!' });
	} else if
	(datastructure.users === undefined || datastructure.users[req.params.id] === undefined) {
		res.status(404).json({ error: 'This user does not exist!' });
	} else {
		datastructure.users[req.params.id].email = req.body.email;
		datastructure.users[req.params.id].fullName = req.body.fullName;
		datastructure.users[req.params.id].dob = req.body.dob;
		res.status(200).json({ message: 'User Profile has been updated!' });
	}
});

usersRouter.put('/users/:id/notifications', (req, res) => {
	const datastructure = req.app.get('appData');
	if (!req.body.reminderTime) {
		res.status(400).json({ error: 'Invalid request!' });
	} else if (req.body.reminderTime === ' ') {
		res.status(422).json({ error: 'Please pick a date for your notification!' });
	} else if (!datastructure.users) {
		res.status(500).json({ error: 'Internal Server Error!' });
	} else if
	(datastructure.users === undefined || datastructure.users[req.params.id] === undefined) {
		res.status(404).json({ error: 'Not Found! This user does not exist!' });
	} else {
		datastructure.users[req.params.id].reminderTime = req.body.reminderTime;
		res.status(200).json({ message: 'Your notification settings has been updated!' });
	}
});

export default usersRouter;
