import test from 'node:test';
import assert from 'node:assert';
/* global fetch */
import http from 'http';
import fs from 'fs';
import app from '../src/app.js';
import { validateMenu } from '../src/validators/menuValidator.js';

test('GET /api/menu endpoints', async (t) => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  
  await t.test('returns 200 and correct JSON structure', async () => {
    const response = await fetch(`http://localhost:${port}/api/menu`);
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.headers.get('content-type').includes('application/json'), true);
    
    const body = await response.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.schemaVersion);
    assert.strictEqual(body.data.currency, 'USD');
    assert.strictEqual(body.data.menuType, 'restaurant');
    assert.strictEqual(body.data.isProvisional, true);
    assert.strictEqual(body.data.publicationStatus, 'draft');
    
    const categories = body.data.categories;
    assert.strictEqual(categories.length, 8, 'Should have exactly 8 categories');
    
    const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);
    assert.strictEqual(totalItems, 46, 'Should have exactly 46 items');
    
    // Check specific representative items
    const allItems = categories.flatMap(c => c.items);
    assert.strictEqual(allItems.length, 46, 'Should have exactly 46 items');
    
    const samosa = allItems.find(i => i.name === 'Samosa');
    assert.strictEqual(samosa.basePriceCents, 225);
    
    const spinachPakora = allItems.find(i => i.name === 'Spinach Pakora');
    assert.strictEqual(spinachPakora.basePriceCents, 544);
    
    const masalaDosa = allItems.find(i => i.name === 'Masala Dosa');
    assert.strictEqual(masalaDosa.basePriceCents, 952);
    
    const threeItemWhite = allItems.find(i => i.name === '3 Item Combo W/White Rice');
    assert.strictEqual(threeItemWhite.basePriceCents, 1399);
    
    const mangoLassi = allItems.find(i => i.name === 'Mango Lassi');
    assert.strictEqual(mangoLassi.basePriceCents, 408);
    
    // Check every item rules
    allItems.forEach(item => {
      assert.strictEqual(item.priceStatus, 'needs-confirmation', `Item ${item.name} status is ${item.priceStatus}`);
      assert.strictEqual(item.needsReview, true);
      if (item.basePriceCents !== null) {
        assert.strictEqual(Number.isInteger(item.basePriceCents), true);
      }
      assert.ok(item.image, `Item ${item.name} is missing an image path`);
      assert.strictEqual(typeof item.image, 'string');
      assert.ok(item.image.startsWith('/images/menu/') || item.image.startsWith('/images/menu-west-v2/'), true);
      
      const fsPath = `../client/public${item.image}`;
      assert.ok(fs.existsSync(fsPath), `Image file missing on disk: ${fsPath}`);
    });

    const dahiWada = allItems.find(i => i.id === 'dahi-wada');
    assert.strictEqual(dahiWada.image, '/images/menu/dahi-wada.webp');
  });
  
  await t.test('unknown routes still return 404', async () => {
    const response = await fetch(`http://localhost:${port}/api/unknown`);
    assert.strictEqual(response.status, 404);
  });
  
  await t.test('catering archive remains valid', () => {
    const archiveData = JSON.parse(fs.readFileSync('data/archive/catering-menu-draft.json', 'utf8'));
    assert.strictEqual(validateMenu(archiveData), true);
    assert.strictEqual(archiveData.menuType, 'catering');
  });

  server.close();
});

test('menuValidator checks', async (t) => {
  const validBase = {
    schemaVersion: 1,
    currency: 'USD',
    menuType: 'catering',
    publicationStatus: 'draft',
    isProvisional: true,
    categories: []
  };

  await t.test('Null prices are accepted when status is not-provided', () => {
    const data = { ...validBase, categories: [{ id: 'c1', name: 'Cat 1', items: [{ id: 'i1', name: 'Item 1', basePriceCents: null, priceStatus: 'not-provided' }] }] };
    assert.strictEqual(validateMenu(data), true);
  });

  await t.test('A confirmed item with a null price is rejected', () => {
    const data = { ...validBase, categories: [{ id: 'c1', name: 'Cat 1', items: [{ id: 'i1', name: 'Item 1', basePriceCents: null, priceStatus: 'confirmed' }] }] };
    assert.throws(() => validateMenu(data), /priceStatus confirmed requires basePriceCents to be an integer/);
  });

  await t.test('A not-provided item with a numeric price is rejected', () => {
    const data = { ...validBase, categories: [{ id: 'c1', name: 'Cat 1', items: [{ id: 'i1', name: 'Item 1', basePriceCents: 499, priceStatus: 'not-provided' }] }] };
    assert.throws(() => validateMenu(data), /priceStatus not-provided requires basePriceCents to be null/);
  });

  await t.test('Floating-point cents are rejected', () => {
    const data = { ...validBase, categories: [{ id: 'c1', name: 'Cat 1', items: [{ id: 'i1', name: 'Item 1', basePriceCents: 4.99, priceStatus: 'confirmed' }] }] };
    assert.throws(() => validateMenu(data), /Item price must be null or a non-negative integer/);
  });

  await t.test('Negative cents are rejected', () => {
    const data = { ...validBase, categories: [{ id: 'c1', name: 'Cat 1', items: [{ id: 'i1', name: 'Item 1', basePriceCents: -50, priceStatus: 'confirmed' }] }] };
    assert.throws(() => validateMenu(data), /Item price must be null or a non-negative integer/);
  });

  await t.test('Duplicate IDs are rejected', () => {
    const data = { ...validBase, categories: [{ id: 'c1', name: 'Cat 1', items: [{ id: 'i1', name: 'Item 1', basePriceCents: 100, priceStatus: 'confirmed' }, { id: 'i1', name: 'Item 2', basePriceCents: 100, priceStatus: 'confirmed' }] }] };
    assert.throws(() => validateMenu(data), /Duplicate item ID: i1/);
  });

  await t.test('Blank names are rejected', () => {
    const data = { ...validBase, categories: [{ id: 'c1', name: 'Cat 1', items: [{ id: 'i1', name: '', basePriceCents: 100, priceStatus: 'confirmed' }] }] };
    assert.throws(() => validateMenu(data), /Item missing name/);
  });

  await t.test('Valid image paths are accepted', () => {
    const data = { ...validBase, categories: [{ id: 'c1', name: 'Cat 1', items: [{ id: 'i1', name: 'Item 1', basePriceCents: 100, priceStatus: 'confirmed', image: '/images/menu/samosa.webp' }] }] };
    assert.strictEqual(validateMenu(data), true);
  });

  await t.test('External URLs are rejected', () => {
    const data = { ...validBase, categories: [{ id: 'c1', name: 'Cat 1', items: [{ id: 'i1', name: 'Item 1', basePriceCents: 100, priceStatus: 'confirmed', image: 'https://example.com/samosa.webp' }] }] };
    assert.throws(() => validateMenu(data), /Image path cannot be an external URL/);
  });

  await t.test('Unsafe traversal paths are rejected', () => {
    const data = { ...validBase, categories: [{ id: 'c1', name: 'Cat 1', items: [{ id: 'i1', name: 'Item 1', basePriceCents: 100, priceStatus: 'confirmed', image: '/images/menu/../../etc/passwd' }] }] };
    assert.throws(() => validateMenu(data), /Image path contains unsafe traversal or external segments/);
  });

  await t.test('Invalid extensions are rejected', () => {
    const data = { ...validBase, categories: [{ id: 'c1', name: 'Cat 1', items: [{ id: 'i1', name: 'Item 1', basePriceCents: 100, priceStatus: 'confirmed', image: '/images/menu/script.js' }] }] };
    assert.throws(() => validateMenu(data), /Image path must end with a supported extension/);
  });
});
