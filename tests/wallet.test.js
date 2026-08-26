const request = require('supertest');
const app = require('../src/app');

// Simplified tests since we don't have a real replica set in standard CI
// that is required for mongo transactions to pass without error.
describe('Wallet API (mocked DB)', () => {
  it('should require authentication for wallet access', async () => {
    const res = await request(app).get('/api/v1/payments/wallet');
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });
});
