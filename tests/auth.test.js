const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Role = require('../src/models/Role');

describe('Auth API (mocked DB)', () => {
  const User = require('../src/models/User');

  beforeAll(() => {
    // Mock mongoose methods so it doesn't hang connecting to a real DB
    jest.spyOn(Role, 'findOne').mockImplementation((query) => {
      if (query.name === 'ADMIN') return Promise.resolve({ _id: '124', name: 'ADMIN' });
      return Promise.resolve(null); // Simulate missing roles (including CUSTOMER) in the DB
    });

    jest.spyOn(Role, 'create').mockImplementation((data) => {
      return Promise.resolve({ _id: '123', name: data.name }); // Mock dynamic role creation
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
    expect(res.body.message).toEqual('Phone number is required');
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

  it('should accept phone as an alias for mobile during registration', async () => {
    const User = require('../src/models/User');
    const findSpy = jest.spyOn(User, 'findOne').mockImplementationOnce(() => Promise.resolve(null)); // Not exists

    // Mock user creation for this test to bypass actually hitting the DB fully
    jest.spyOn(User, 'create').mockImplementationOnce(() => Promise.resolve({
      _id: 'newuser123',
      mobile: '9876543210',
      phone: '9876543210',
    }));

    // Also mock CustomerProfile.create to not fail since CUSTOMER role is assumed
    const CustomerProfile = require('../src/models/CustomerProfile');
    jest.spyOn(CustomerProfile, 'create').mockImplementationOnce(() => Promise.resolve({}));

    // Mock ID sequence generator
    const IDSequence = require('../src/models/IDSequence');
    jest.spyOn(IDSequence, 'findOneAndUpdate').mockImplementationOnce(() => Promise.resolve({ sequence: 1 }));

    // Mock jwt generateTokens to avoid signing real tokens and trying to read real env vars
    const jwtUtils = require('../src/utils/jwt');
    jest.spyOn(jwtUtils, 'generateTokens').mockImplementationOnce(() => ({
      accessToken: 'mockedToken',
      refreshToken: 'mockedRefresh'
    }));

    const res = await request(app).post('/api/v1/auth/register').send({
      phone: '9876543210',
      password: 'password123',
    });
    expect(res.statusCode).toEqual(201);
    expect(findSpy).toHaveBeenCalledWith({ $or: [{ phone: '9876543210' }, { mobile: '9876543210' }] });
  });

  it('should prevent registration if mobile/phone is missing', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      password: 'password123'
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Phone number is required');
  });
});
