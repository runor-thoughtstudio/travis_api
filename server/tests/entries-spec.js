import chai from 'chai';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Request from '../helpers/requests';

dotenv.config();
const { expect } = chai;
const request = new Request();
const payload = {
	email: 'kamp@gmail.com',
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

		it('should give error on sending incorrect form data', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries`;
			const formData = {
				name: ' ',
				body: 'New Description',
			};
			request.postOrPut('POST', url, formData, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('updateEntry()', () => {
		it('validation should fail when any form field is empty', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries/4`;
			const formData = {
				title: ' ',
				description: 'Cool',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill all the input fields!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('should give error when incorrect form data is sent', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries/4`;
			const formData = {
				name: 'First Title',
				body: 'Cool',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('deleteEntry()', () => {
		it('should show error when id doesnt exist', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries/700`;
			request.getOrDelete('DELETE', url, headers, (error, res, body) => {
				console.log(error);
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('This entry does not exist or you do not have permission to delete it!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});
});
