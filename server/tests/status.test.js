import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';

import app from '../src/app.js';

test('GET /api/status should return 200 and correct JSON structure', async () => {
  const response = await request(app)
    .get('/api/status')
    .expect('Content-Type', /json/)
    .expect(200);

  assert.strictEqual(response.body.success, true);
  assert.strictEqual(response.body.message, 'Samosa House API is running');
  assert.strictEqual(response.body.data.status, 'ok');
});

test('Unknown API route should return 404 and error JSON', async () => {
  const response = await request(app)
    .get('/api/unknown')
    .expect('Content-Type', /json/)
    .expect(404);

  assert.strictEqual(response.body.success, false);
  assert.strictEqual(response.body.message, 'Route not found');
});
