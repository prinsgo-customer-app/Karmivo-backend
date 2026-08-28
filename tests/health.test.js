const request = require('supertest');
const app = require('../src/app');

describe('Health Check API', () => {
  it('should return 200 OK and status UP', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('UP');
    expect(res.body.message).toEqual('Karmivo API is healthy');
  });

  it('should return 200 OK for root endpoint', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Welcome to Karmivo API');
  });
});
