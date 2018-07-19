import chai from 'chai';
import dotenv from 'dotenv';
import Request from '../lib/requests';
import { mainServer } from '../app';

dotenv.config();
const { expect } = chai;
const request = new Request();
const user = {
	email: 'user1@example.com',
	password: 'password',
	fullName: 'User Name',
	dob: '2018-04',
};
