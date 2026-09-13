import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../prisma/client.js';

test('Admin API Tests', async (t) => {
  let ownerCookie = '';
  let staffCookie = '';
  let csrfToken = '';

  await t.test('GET /api/admin/csrf returns a token and cookie', async () => {
    const res = await request(app).get('/api/admin/csrf');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.csrfToken);
    csrfToken = res.body.csrfToken;
  });

  await t.test('POST /api/admin/auth/login fails with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/admin/auth/login')
      .set('X-CSRF-Token', csrfToken)
      .set('Cookie', [`csrf_token=${csrfToken}`])
      .send({ email: 'wrong', password: 'wrong' });
    assert.strictEqual(res.status, 401);
  });

  // Since we haven't bootstrapped in tests, we skip full auth flows, but we can verify middleware
  await t.test('GET /api/admin/menu fails without auth', async () => {
    const res = await request(app).get('/api/admin/menu');
    assert.strictEqual(res.status, 401); // Unauthorized
  });

  await t.test('POST /api/admin/menu/publish fails without auth', async () => {
    const res = await request(app)
      .post('/api/admin/menu/publish')
      .set('X-CSRF-Token', csrfToken)
      .set('Cookie', [`csrf_token=${csrfToken}`]);
    assert.strictEqual(res.status, 401);
  });
});
