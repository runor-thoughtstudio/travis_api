import chai from 'chai';
import nock from 'nock';
import dotenv from 'dotenv';
import Request from '../lib/requests';

dotenv.config();
const { expect } = chai;
const request = new Request();
