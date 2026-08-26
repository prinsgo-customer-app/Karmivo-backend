const request = require('supertest');
const app = require('../src/app');

describe('Auth API (mocked DB)', () => {
  it('should return validation error if missing fields', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Mobile or email is required');
  });

  it('should return validation error if password missing in login', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({email: 'test@example.com'});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toEqual('Password is required');
  });
});
