import request from 'supertest';

import app from '../app';
import db from '../db';

// Test data
const testBlock = {
  height: 15640101,
  hash: '118F3A33ED21ED94CD3AB4170F9752D562E1B42B07671511FDCBA9D6896C339C',
};
const testTransaction = {
  hash: 'ECF3504B48CB4427E23F29754EACB76030C01284E807D219AE69972F7F279C4E',
  from_address: 'cosmos1y0lvpvf6rcl7aqldx5jh3eef22s4vyx9p4n4r7',
  to_address: 'cosmos155svs6sgxe55rnvs6ghprtqu0mh69kehrn0dqr',
  asset: 'uatom',
  amount: '22279953',
  memo: null,
  block_height: '15640101',
};

// Add data to the database before each test
beforeEach(async () => {
  await db('blocks').insert(testBlock);
  await db('transactions').insert(testTransaction);
});

// Remove data from the database after each test
afterEach(async () => {
  await db('blocks').where(testBlock).delete();
  await db('transactions').where(testTransaction).delete();
});

describe('GET /block/:height', () => {
  it('should respond with a block', async () => {
    const res = await request(app).get(`/block/${testBlock.height}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('height', testBlock.height);
    expect(res.body).toHaveProperty('hash', testBlock.hash);
    expect(res.body).toHaveProperty('transactions');
    expect(res.body.transactions[0].hash).toBe(testTransaction.hash);
  });

  it('should respond with an error if the block does not exist', async () => {
    const nonExistentHeight = 989848859595;
    const res = await request(app).get(`/block/${nonExistentHeight}`);

    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('errorMessage');
  });
});

describe('GET /transaction/:hash', () => {
  it('should respond with a transaction', async () => {
    const res = await request(app).get(`/transaction/${testTransaction.hash}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('hash', testTransaction.hash);
    expect(res.body).toHaveProperty('fromAddress', testTransaction.from_address);
    expect(res.body).toHaveProperty('toAddress', testTransaction.to_address);
  });

  it('should respond with an error if the transaction does not exist', async () => {
    const nonExistentHash = testTransaction.hash + '1';
    const res = await request(app).get(`/transaction/${nonExistentHash}`);

    expect(res.status).toEqual(404);
    expect(res.body).toHaveProperty('errorMessage');
  });
});

describe('GET /addresses/:address/txs', () => {
  it('should respond with a list of transactions', async () => {
    const res = await request(app).get(`/addresses/${testTransaction.from_address}/txs`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('hash', testTransaction.hash);
  });

  it('should respond with an empty list if the address has no transactions', async () => {
    const nonExistentAddress = 'cosmos1' + '0'.repeat(38);
    const res = await request(app).get(`/addresses/${nonExistentAddress}/txs`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});
