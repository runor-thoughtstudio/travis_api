import chai from 'chai';
// import nock from 'nock';
import dotenv from 'dotenv';
import Request from '../lib/requests';
import { mainServer } from '../app';

dotenv.config();
const { expect } = chai;
const request = new Request();

describe('Test Entries Routes', () => {
	after(() => {
		mainServer.close();
	});
	describe('allEntries()', () => {
		it('should show all entries in the app', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/entries`;
			request.get(url, (error, res, body) => {
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
			request.get(url, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(200);
				expect(jsonObject).to.be.a('object');
				done();
			});
		}).timeout(10000);

		it('should show 404 not found when id doesnt exist', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/entries/10`;
			request.get(url, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(404);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('This entry cannot be found!');
				done();
			});
		}).timeout(10000);

		it('should show 400 not id is not an integer', (done) => {
			const url = `${process.env.root_url}/${process.env.version_url}/entries/abc`;
			request.get(url, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(400);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Bad Request!');
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
			request.post(url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(201);
				expect(jsonObject).to.be.a('object');
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
			request.post(url, formData, (error, res, body) => {
				const jsonObject = JSON.parse(body);
				expect(res.statusCode).to.be.equal(422);
				expect(jsonObject).to.be.a('object');
				expect(jsonObject.error).to.be.equal('Please fill in all the fields properly!');
				done();
			});
		}).timeout(10000);
	});
});
