import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../prisma/client.js';
import crypto from 'crypto';

import { hashPassword } from '../src/services/authService.js';

describe('Admin Menu Concurrency Tests', () => {
  let ownerCookie;
  let csrfToken;
  let testItemId;
  let testUserId = 'test-admin-id';

  before(async () => {
    // Ensure test user exists
    const pwdHash = await hashPassword('testpassword');
    await prisma.user.upsert({
      where: { email: 'testadmin@example.com' },
      update: { passwordHash: pwdHash },
      create: { id: testUserId, email: 'testadmin@example.com', displayName: 'Test Admin', passwordHash: pwdHash, role: 'OWNER' }
    });

    const csrfRes = await request(app).get('/api/admin/csrf');
    const initialCookie = csrfRes.headers['set-cookie'][0].split(';')[0];
    csrfToken = csrfRes.body.csrfToken;

    const loginRes = await request(app)
      .post('/api/admin/auth/login')
      .set('Cookie', initialCookie)
      .set('x-csrf-token', csrfToken)
      .send({ email: 'testadmin@example.com', password: 'testpassword' });
    
    ownerCookie = initialCookie + '; ' + loginRes.headers['set-cookie'][0].split(';')[0];

    // Create a dummy draft item
    const newItem = await prisma.menuItem.create({
      data: {
        id: crypto.randomUUID(),
        slug: 'concurrency-test-' + Date.now(),
        categoryId: 'appetizers',
        name: 'Concurrency Test Item',
        description: 'Test',
        priceCents: 100,
        imageUrl: '/test.jpg',
        isAvailable: true,
        hasDraftChanges: true,
        draftName: 'Concurrency Test Item Draft',
        version: 1,
        displayOrder: 99
      }
    });
    testItemId = newItem.id;
  });

  after(async () => {
    if (testItemId) {
      await prisma.menuItem.delete({ where: { id: testItemId } });
    }
  });

  it('Concurrent Publish should return 409 and rollback', async () => {
    // Fire two publish requests simultaneously
    const req1 = request(app)
      .post('/api/admin/menu/publish')
      .set('Cookie', ownerCookie)
      .set('x-csrf-token', csrfToken)
      .send();

    const req2 = request(app)
      .post('/api/admin/menu/publish')
      .set('Cookie', ownerCookie)
      .set('x-csrf-token', csrfToken)
      .send();

    const [res1, res2] = await Promise.all([req1, req2]);
    
    // One should succeed (200), one should fail (409)
    const statuses = [res1.status, res2.status];
    assert.ok(statuses.includes(200), 'One request should succeed');
    assert.ok(statuses.includes(409), 'One request should fail with 409 Conflict');
    assert.ok(!statuses.includes(500), 'No request should throw 500 error');
  });
});
