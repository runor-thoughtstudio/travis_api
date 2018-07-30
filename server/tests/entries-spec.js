import chai from 'chai';
// import nock from 'nock';
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
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill in all the fields properly!');
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
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.message).to.be.equal('Please fill in all the fields properly!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);

		it('show error 404 when id does not exist', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries/0`;
			const formData = {
				title: 'First Title',
				description: 'Cool',
			};
			request.postOrPut('PUT', url, formData, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject.message).to.be.equal('This entry does not exist!');
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
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('Bad request!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});

	describe('showEntry()', () => {
		it('should show 404 not found when id doesnt exist', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries/0`;
			request.getOrDelete('GET', url, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject.error).to.be.equal('No entry found!');
				expect(jsonObject.title).to.be.an('undefined');
				expect(jsonObject.description).to.be.an('undefined');
				done();
			});
		}).timeout(30000);
	});

	describe('allEntries()', () => {
		it('should show all entries in the app', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries`;
			request.getOrDelete('GET', url, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.message).to.be.equal('Retrieved');
				expect(jsonObject.data).to.be.a('array');
				done();
			});
		}).timeout(30000);
	});

	describe('deleteEntry()', () => {
		it('should show error when id doesnt exist', (done) => {
			const url = `${process.env.root_url}${process.env.version_url}/entries/0`;
			request.getOrDelete('DELETE', url, headers, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.message).to.be.equal('This entry does not exist or you do not have permission to delete it!');
				expect(jsonObject.status).to.be.equal('Failed');
				done();
			});
		}).timeout(30000);
	});
});
