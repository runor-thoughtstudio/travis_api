import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import CreateSchema from './models/CreateSchema';
import entriesRouter from './routes/entriesApi';
import usersRouter from './routes/usersApi';

dotenv.config();
const app = express();
const createDb = new CreateSchema();
const dataStructure = {
	entries: [{
		title: 'First', description: 'The description',
	}],
	users: [{
		email: 'user@example.com', password: 'password', fullName: 'Example User', dob: '2018-06', reminderTime: '',
	}],
};
createDb.createDb();
app.set('port', process.env.PORT || 3000);
app.set('appData', dataStructure);
app.set('appVersion', '/api/v1');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(app.get('appVersion'), entriesRouter);
app.use(app.get('appVersion'), usersRouter);
app.get('*', (req, res) => {
	res.status(404).json({ error: 'Not Found! The page you are trying to access does not exist!' });
});
const server = app.listen(app.get('port'), () => {
	// console.log('Application started. Listening :)');
});

export const mainApp = app;
export const mainServer = server;
