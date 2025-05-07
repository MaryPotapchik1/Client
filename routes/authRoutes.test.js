const request = require('supertest');
const app = require('../app'); // путь к express-приложению
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // если нужно

const TEST_USER = {
  email: 'testuser@example.com',
  password: 'TestPass123!',
};

let token;

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Auth routes integration', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send(TEST_USER);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
  });

  it('should login user and return token', async () => {
    const res = await request(app)
      .post('/api/login')
      .send(TEST_USER);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should verify token and return user', async () => {
    const res = await request(app)
      .get('/api/verify')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
  });

  it('should create or update profile', async () => {
    const res = await request(app)
      .post('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Test',
        lastName: 'User',
        birthDate: '1990-01-01',
        phone: '1234567890',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('profile');
  });

  it('should get user profile', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('profile');
  });
});

describe('Family members routes', () => {
  let familyMemberId;

  it('should add a family member', async () => {
    const res = await request(app)
      .post('/api/family-members')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Child One',
        birthDate: '2020-01-01',
        relationship: 'child',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('member');
    familyMemberId = res.body.member._id;
  });

  it('should update a family member', async () => {
    const res = await request(app)
      .put(`/api/family-members/${familyMemberId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Child One Updated',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should delete a family member', async () => {
    const res = await request(app)
      .delete(`/api/family-members/${familyMemberId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
