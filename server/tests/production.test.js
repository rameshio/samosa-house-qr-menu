import test from 'node:test';
import assert from 'node:assert';
import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/* global fetch */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Production static serving', async (t) => {
  // Set to production before dynamic import
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  
  // Create a fake dist directory for testing
  const distPath = path.join(__dirname, '../../client/dist');
  await fs.mkdir(distPath, { recursive: true });
  await fs.writeFile(path.join(distPath, 'index.html'), '<html>React App</html>');
  
  // Dynamically import app so it evaluates NODE_ENV === 'production'
  const { default: app } = await import('../src/app.js?test=' + Date.now());
  
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  
  await t.test('Root returns React application', async () => {
    const res = await fetch(`http://localhost:${port}/`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.strictEqual(text.includes('React App'), true);
  });
  
  await t.test('/api/menu behavior remains unchanged', async () => {
    const res = await fetch(`http://localhost:${port}/api/menu`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  });
  
  await t.test('Unknown /api/* requests return JSON 404', async () => {
    const res = await fetch(`http://localhost:${port}/api/unknown-endpoint`);
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.message, 'Route not found');
  });
  
  await t.test('Missing static assets are not replaced with index.html', async () => {
    const res = await fetch(`http://localhost:${port}/non-existent.jpg`);
    assert.strictEqual(res.status, 404);
    const text = await res.text();
    // It should not be the React app
    assert.strictEqual(text.includes('React App'), false);
  });
  
  // Cleanup
  server.close();
  await fs.rm(distPath, { recursive: true, force: true });
  process.env.NODE_ENV = originalEnv;
});
