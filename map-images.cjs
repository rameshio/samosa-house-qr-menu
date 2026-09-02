const fs = require('fs');
const path = require('path');

const menuPath = 'server/data/menu.json';
const sourceDir = 'Poject files/samosa-house-menu-images';
const targetDir = 'client/public/images/menu';

const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(sourceDir, 'manifest.json'), 'utf8'));

// Identify duplicates from manifest
const duplicateItems = new Set();
manifest.duplicateSourceGroups.forEach(group => {
  group.forEach(itemName => duplicateItems.add(itemName));
});

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

let md = '# Image Asset Mapping\n\n';
md += '| Source Filename | Destination Filename | Menu Item ID | Menu Item Name | Status | Notes |\n';
md += '|---|---|---|---|---|---|\n';

let confirmedCount = 0;
let duplicateCount = 0;
let unmatchedCount = 0;
let uncertainCount = 0;

menuData.categories.forEach(category => {
  category.items.forEach(item => {
    // Find item in manifest
    const manifestImg = manifest.images.find(img => img.item === item.name);
    
    if (!manifestImg) {
      unmatchedCount++;
      md += `| N/A | N/A | \`${item.id}\` | ${item.name} | unmatched | No image found in manifest for this item. |\n`;
      return;
    }
    
    const isDuplicate = duplicateItems.has(item.name);
    
    // We will use the web-optimized webp file
    const sourceRelative = manifestImg.optimizedFile;
    const ext = path.extname(sourceRelative);
    const targetFile = `${item.id}${ext}`;
    
    const sourceFullPath = path.join(sourceDir, sourceRelative);
    
    if (!fs.existsSync(sourceFullPath)) {
      unmatchedCount++;
      md += `| \`${sourceRelative}\` | N/A | \`${item.id}\` | ${item.name} | unmatched | Source file missing. |\n`;
      return;
    }
    
    if (isDuplicate) {
      duplicateCount++;
      md += `| \`${sourceRelative}\` | N/A | \`${item.id}\` | ${item.name} | duplicate | Wix site uses the same image for multiple items. Left unmapped for manual review. |\n`;
      return;
    }
    
    // Confirmed match
    confirmedCount++;
    md += `| \`${sourceRelative}\` | \`${targetFile}\` | \`${item.id}\` | ${item.name} | confirmed | Safely mapped. |\n`;
    
    // Copy the file
    fs.copyFileSync(sourceFullPath, path.join(targetDir, targetFile));
    
    // Update the JSON in memory
    item.image = `/images/menu/${targetFile}`; // Will overwrite JSON later
  });
});

fs.writeFileSync('docs/IMAGE_ASSET_MAPPING.md', md);
fs.writeFileSync(menuPath, JSON.stringify(menuData, null, 2) + '\n');

console.log(`Mapping complete: ${confirmedCount} confirmed, ${duplicateCount} duplicate, ${unmatchedCount} unmatched.`);
