import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.set('port', process.env.PORT || 3000);

app.set('appVersion', '/api/v1');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const server = app.listen(app.get('port'), () => {
	// console.log('Application started. Listening :)');
});

export const mainApp = app;
export const mainServer = server;
