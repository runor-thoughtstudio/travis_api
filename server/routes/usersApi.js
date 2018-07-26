import express from 'express';
import UserController from '../controllers/UserController';

const usersRouter = express.Router();
const User = new UserController();

usersRouter.post('/auth/signup', (req, res) => {
	User.signUp(req, res);
});

usersRouter.post('/users/signin', (req, res) => {
	User.signIn(req, res);
});

usersRouter.get('/users/:id', (req, res) => {
	User.show(req, res);
});

usersRouter.put('/users/:id', (req, res) => {
	User.update(req, res);
});

usersRouter.put('/users/:id/notifications', (req, res) => {
	User.saveNotification(req, res);
});

export default usersRouter;
