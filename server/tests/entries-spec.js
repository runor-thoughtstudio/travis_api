// import chai from 'chai';
// import dotenv from 'dotenv';
// // import jwt from 'jsonwebtoken';
// import Request from '../helpers/requests';
//
// dotenv.config();
// const { expect } = chai;
// const request = new Request();
// // const payload = {
// // 	email: 'kamp@gmail.com',
// // 	id: 1,
// // };
// // const token = jwt.sign(payload, process.env.secret_token, { expiresIn: 6000 });
// let toke = null;
// const headers = {
// 	toke,
// };
//
// describe('Test Entries Routes', () => {
// 	describe('siginUser()', () => {
// 		it('should signin user', (done) => {
// 			const url = `${process.env.root_url}${process.env.version_url}/auth/login`;
// 			const formData = {
// 				email: 'kamp@gmail.com',
// 				password: 'password',
// 			};
// 			request.postOrPut('POST', url, formData, headers, (error, res, body) => {
// 				toke = body.token;
// 				const jsonObject = JSON.parse(body);
// 				expect(res.statusCode).to.be.equal(200);
// 				expect(jsonObject.message).to.be.equal('You have signed in successfully!');
// 				expect(jsonObject.status).to.be.equal('Success');
// 				done();
// 			});
// 		}).timeout(30000);
// 	});
//
// 	describe('createEntry()', () => {
// 		it('validation should fail when any form field is empty', (done) => {
// 			console.log('below');
// 			console.log(toke);
// 			const url = `${process.env.root_url}${process.env.version_url}/entries`;
// 			const formData = {
// 				title: ' ',
// 				description: 'New Description',
// 			};
// 			request.postOrPut('POST', url, formData, headers, (error, res, body) => {
// 				console.log(error);
// 				const jsonObject = JSON.parse(body);
// 				expect(res.statusCode).to.be.equal(422);
// 				expect(jsonObject.message).to.be.equal('Please fill all the input fields!');
// 				expect(jsonObject.status).to.be.equal('Failed');
// 				done();
// 			});
// 		}).timeout(30000);
// 	});
// });
