const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Role = require('../src/models/Role');

describe('Auth API (mocked DB)', () => {
  const User = require('../src/models/User');

  beforeAll(() => {
    // Mock mongoose methods so it doesn't hang connecting to a real DB
    jest.spyOn(Role, 'findOne').mockImplementation((query) => {
      if (query.name === 'CUSTOMER') return Promise.resolve({ _id: '123', name: 'CUSTOMER' });
      if (query.name === 'ADMIN') return Promise.resolve({ _id: '124', name: 'ADMIN' });
      return Promise.resolve(null); // Invalid role
    });

    // Quick exit for successful role lookup by pretending the user already exists (409)
    jest.spyOn(User, 'findOne').mockImplementation(() => Promise.resolve({ _id: '456' }));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
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

  it('should reject registration with a truly invalid role', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      mobile: '1234567890',
      password: 'password123',
      roleName: 'INVALID_ROLE_XYZ'
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Invalid role');
  });

  it('should fallback to CUSTOMER if roleName is null', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      mobile: '1234567890',
      password: 'password123',
      roleName: null
    });
    // Mock user findOne returns 409 User exists, meaning role validation PASSED
    expect(res.statusCode).toEqual(409);
  });

  it('should fallback to CUSTOMER if role is sent instead of roleName', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      mobile: '1234567890',
      password: 'password123',
      role: 'customer'
    });
    expect(res.statusCode).toEqual(409);
  });

  it('should alias USER to CUSTOMER', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      mobile: '1234567890',
      password: 'password123',
      roleName: 'user'
    });
    expect(res.statusCode).toEqual(409);
  });

  it('should fallback to CUSTOMER if roleName is stringified undefined', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      mobile: '1234567890',
      password: 'password123',
      roleName: 'undefined'
    });
    expect(res.statusCode).toEqual(409);
  });
});
