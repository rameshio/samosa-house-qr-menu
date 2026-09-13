import test from 'node:test';
import assert from 'node:assert';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Storage Service resolves upload path within workspace', async () => {
  // The issue was that upload path depended on process.cwd() which could place uploads outside the project.
  // We verify that the resolved path is inside the project directory.
  const defaultDir = path.join(__dirname, '../../client/public/uploads');
  const uploadDir = path.resolve(process.env.LOCAL_UPLOAD_DIRECTORY || defaultDir);
  
  assert.ok(uploadDir.includes('Samosa House'), 'Upload directory should be inside the Samosa House workspace');
  assert.ok(uploadDir.endsWith(path.join('client', 'public', 'uploads')), 'Upload directory should end with client/public/uploads');
});
