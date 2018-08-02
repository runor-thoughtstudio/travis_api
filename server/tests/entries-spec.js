import chai from 'chai';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Request from '../helpers/requests';

dotenv.config();
const { expect } = chai;
const request = new Request();
const payload = {
	email: 'kampp@gmail.com',
	id: 1,
};
const token = jwt.sign(payload, process.env.secret_token, { expiresIn: 6000 });
const headers = {
	token,
};

describe('Test Entries Routes', () => {
	describe('createEntry()', () => {
		it('validation should fail when any form field is empty', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries`;
			const formData = {
				title: ' ',
				description: 'New Description',
			};
			request.postOrPut('POST', url, formData, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill all the input fields!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});
});
