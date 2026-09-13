import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';

test('Rate Limiter Tests', async (t) => {
  await t.test('Login has a separate strict limiter', async () => {
    const csrfRes = await request(app).get('/api/admin/csrf');
    const csrfToken = csrfRes.body.csrfToken;

    let res;
    for (let i = 0; i < 6; i++) {
      res = await request(app).post('/api/admin/auth/login')
        .set('X-CSRF-Token', csrfToken)
        .set('Cookie', [`csrf_token=${csrfToken}`])
        .send({ email: 'test', password: 'test' });
    }
    assert.strictEqual(res.status, 429);
    assert.strictEqual(res.body.message, 'Too many login attempts, please try again later.');
  });

  await t.test('General public requests do not consume the login failure allowance', async () => {
    const csrfRes = await request(app).get('/api/admin/csrf').set('X-Forwarded-For', '1.2.3.4');
    const csrfToken = csrfRes.body.csrfToken;
    for (let i = 0; i < 10; i++) {
      await request(app).get('/api/status').set('X-Forwarded-For', '1.2.3.4');
    }
    const res = await request(app).post('/api/admin/auth/login')
      .set('X-Forwarded-For', '1.2.3.4')
      .set('X-CSRF-Token', csrfToken)
      .set('Cookie', [`csrf_token=${csrfToken}`])
      .send({ email: 'test', password: 'test' });
    assert.notStrictEqual(res.status, 429);
  });
});
