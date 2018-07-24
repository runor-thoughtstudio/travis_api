import chai from 'chai';
// import nock from 'nock';
import dotenv from 'dotenv';
import Request from '../lib/requests';

dotenv.config();
const { expect } = chai;
const request = new Request();

describe('Test Entries Routes', () => {
	describe('allEntries()', () => {
		it('should show all entries in the app', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/entries`;
			request.getOrDelete('GET', url, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject).to.be.a('array');
				done();
			});
		}).timeout(10000);
	});

	describe('showEntry()', () => {
		it('should show an entry when the id exists', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/entries/0`;
			request.getOrDelete('GET', url, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.title).to.not.be.an('undefined');
				expect(jsonObject.description).to.not.be.an('undefined');
				done();
			});
		}).timeout(10000);

		it('should show 404 not found when id doesnt exist', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/entries/10`;
			request.getOrDelete('GET', url, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject.error).to.be.equal('This entry cannot be found!');
				expect(jsonObject.title).to.be.an('undefined');
				expect(jsonObject.description).to.be.an('undefined');
				done();
			});
		}).timeout(10000);

		it('should show 400 when id is not an integer', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/entries/abc`;
			request.getOrDelete('GET', url, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.error).to.be.equal('Bad Request!');
				expect(jsonObject.title).to.be.an('undefined');
				expect(jsonObject.description).to.be.an('undefined');
				done();
			});
		}).timeout(10000);
	});

	describe('createEntry()', () => {
		it('should create an entry when form data is correct', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/entries`;
			const formData = {
				title: 'New Title',
				description: 'New Description',
			};
			request.postOrPut('POST', url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(201);
				expect(jsonObject.message).to.be.equal('The entry has been created!');
				done();
			});
		}).timeout(10000);

		it('validation should fail when any form field is empty', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/entries`;
			const formData = {
				title: ' ',
				description: 'New Description',
			};
			request.postOrPut('POST', url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.error).to.be.equal('Please fill in all the fields properly!');
				done();
			});
		}).timeout(10000);

		it('should give error on sending incorrect form data', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/entries`;
			const formData = {
				name: ' ',
				body: 'New Description',
			};
			request.postOrPut('POST', url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.error).to.be.equal('Invalid request!');
				done();
			});
		}).timeout(10000);
	});

	describe('updateEntry()', () => {
		it('should update an entry on correct form data', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/entries/0`;
			const formData = {
				title: 'Title',
				description: 'Cool',
			};
			request.postOrPut('PUT', url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject.message).to.be.equal('This entry has been updated!');
				done();
			});
		}).timeout(10000);

		it('validation should fail when any form field is empty', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/entries/0`;
			const formData = {
				title: ' ',
				description: 'Cool',
			};
			request.postOrPut('PUT', url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject.error).to.be.equal('Please fill in all the fields properly!');
				done();
			});
		}).timeout(10000);

		it('show error 404 when id does not exist', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/entries/10`;
			const formData = {
				title: 'First Title',
				description: 'Cool',
			};
			request.postOrPut('PUT', url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject.error).to.be.equal('This entry does not exist!');
				done();
			});
		}).timeout(10000);

		it('should give error when incorrect form data is sent', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/entries/0`;
			const formData = {
				name: 'First Title',
				body: 'Cool',
			};
			request.postOrPut('PUT', url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject.error).to.be.equal('Invalid request!');
				done();
			});
		}).timeout(10000);
	});

	describe('deleteEntry()', () => {
		it('should delete an entry when id exists', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/entries/0`;
			request.getOrDelete('DELETE', url, (error, res, body) => {
				expect(res.statusCode).to.be.equal(204);
				expect(body).to.be.equal('');
				done();
			});
		}).timeout(10000);

		it('should show error when id doesnt exist', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/entries/10`;
			request.getOrDelete('DELETE', url, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject.error).to.be.equal('This entry does not exist!');
				done();
			});
		}).timeout(10000);
	});
});
