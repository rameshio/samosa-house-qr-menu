import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const files = {
  'server/src/repositories/menuRepository.js': `
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../../../data/menu.json');

export const getMenuData = async () => {
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
};
`,
  'server/src/validators/menuValidator.js': `
export const validateMenu = (data) => {
  if (!data || typeof data !== 'object') throw new Error('Invalid JSON format');
  if (data.schemaVersion === undefined) throw new Error('Missing schemaVersion');
  if (data.currency !== 'USD') throw new Error('Currency must be USD');
  if (!Array.isArray(data.categories)) throw new Error('Categories must be an array');
  
  // Basic deep validation
  data.categories.forEach(category => {
    if (!category.id || !category.name) throw new Error('Category missing id or name');
    if (!Array.isArray(category.items)) throw new Error('Category items must be an array');
    category.items.forEach(item => {
      if (!item.id || !item.name) throw new Error('Item missing id or name');
      if (typeof item.basePriceCents !== 'number' || item.basePriceCents < 0) {
        throw new Error('Item price must be a non-negative integer');
      }
    });
  });
  
  return true;
};
`,
  'server/src/controllers/menuController.js': `
import { getMenuData } from '../repositories/menuRepository.js';
import { validateMenu } from '../validators/menuValidator.js';

export const getMenu = async (req, res, _next) => {
  try {
    const menuData = await getMenuData();
    validateMenu(menuData);
    
    res.status(200).json({
      success: true,
      data: menuData
    });
  } catch (error) {
    // Return safe JSON error without exposing filesystem paths or stack traces
    res.status(500).json({
      success: false,
      message: 'Failed to load menu data'
    });
  }
};
`,
  'server/src/routes/menuRoutes.js': `
import { Router } from 'express';
import { getMenu } from '../controllers/menuController.js';

const router = Router();

router.get('/menu', getMenu);

export default router;
`,
  'server/tests/menu.test.js': `
import test from 'node:test';
import assert from 'node:assert';
import http from 'http';
import app from '../src/app.js';

test('GET /api/menu', async (t) => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  
  await t.test('returns 200 and correct JSON structure', async () => {
    const response = await fetch(\`http://localhost:\${port}/api/menu\`);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.headers.get('content-type').includes('application/json'), true);
    
    const body = await response.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.schemaVersion);
    assert.strictEqual(body.data.currency, 'USD');
    assert.ok(Array.isArray(body.data.categories));
    
    // Check IDs and prices
    const itemIds = new Set();
    const categoryIds = new Set();
    body.data.categories.forEach(c => {
      assert.ok(!categoryIds.has(c.id), 'Category IDs must be unique');
      categoryIds.add(c.id);
      c.items.forEach(i => {
        assert.ok(!itemIds.has(i.id), 'Item IDs must be unique');
        itemIds.add(i.id);
        assert.ok(Number.isInteger(i.basePriceCents) && i.basePriceCents >= 0, 'Price must be non-negative integer');
      });
    });
  });
  
  await t.test('unknown routes still return 404', async () => {
    const response = await fetch(\`http://localhost:\${port}/api/unknown\`);
    assert.strictEqual(response.status, 404);
  });
  
  server.close();
});
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(rootDir, filePath);
  const dirPath = path.dirname(fullPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trim());
}
console.log('Backend generated.');
