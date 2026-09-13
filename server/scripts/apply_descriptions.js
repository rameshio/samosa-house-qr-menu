import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SOURCE_PATH = '../samosa-content/source-menu.json';

// Claims keywords
const CLAIM_KEYWORDS = [
  'vegan', 'gluten-free', 'gf', 'dairy-free', 'nut', 'nuts', 'cashew', 'almond',
  'spicy', 'mild', 'serves', 'oz', 'fresh', 'organic', 'homemade', 'house-made',
  'halal', 'kosher'
];

async function updateDescriptions() {
  const sourceRaw = fs.readFileSync(SOURCE_PATH, 'utf8');
  const sourceData = JSON.parse(sourceRaw);
  
  // Flatten source items
  const sourceItems = [];
  sourceData.menu.forEach(cat => {
    cat.items.forEach(item => {
      sourceItems.push(item);
    });
  });

  const dbItems = await prisma.menuItem.findMany();
  
  const matched = [];
  const unmatched = [];
  const claimsReview = [];

  for (const dbItem of dbItems) {
    // Try to match by exact name or very close name
    // (Ignoring case, special chars)
    const normalize = str => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const dbNameNorm = normalize(dbItem.name);
    
    let match = sourceItems.find(src => normalize(src.name) === dbNameNorm);
    
    // Fallback logic for renamed items
    if (!match) {
      if (dbNameNorm === 'samosa') match = sourceItems.find(src => normalize(src.name) === 'artisansamosa');
      else if (dbNameNorm === 'dahipuri') match = sourceItems.find(src => normalize(src.name) === 'dahisevpuri');
      else if (dbNameNorm === 'paperdosa') match = sourceItems.find(src => normalize(src.name) === 'crispypaperdosa');
      else if (dbNameNorm === 'masaladosa') match = sourceItems.find(src => normalize(src.name) === 'classicmasaladosa');
      else if (dbNameNorm === 'idlivadaplate') match = sourceItems.find(src => normalize(src.name) === 'idliwadacomboplate');
      else if (dbNameNorm === 'veganmangolassi') match = sourceItems.find(src => normalize(src.name) === 'handcraftedmangolassi');
      else if (dbNameNorm === 'rosemilk') match = sourceItems.find(src => normalize(src.name) === 'royalrosemilk');
      else if (dbNameNorm === 'sweetlassi') match = sourceItems.find(src => normalize(src.name) === 'sweetcardamomlassi');
      else if (dbNameNorm === 'tomatochilliuttapam') match = sourceItems.find(src => normalize(src.name) === 'tomatocilantrouttapam');
      else if (dbNameNorm === 'onionchilliuttapam') match = sourceItems.find(src => normalize(src.name) === 'onionchilliuttapam');
    }

    // Try partial word matches if still not found, but be strict
    if (!match) {
      const bestMatch = sourceItems.find(src => {
        const srcWords = src.name.toLowerCase().split(/\s+/);
        const dbWords = dbItem.name.toLowerCase().split(/\s+/);
        const common = srcWords.filter(w => dbWords.includes(w));
        
        // Prevent confusing tomato and onion
        if (dbWords.includes('tomato') && !srcWords.includes('tomato')) return false;
        if (dbWords.includes('onion') && !srcWords.includes('onion')) return false;

        return common.length >= 2 || (common.length === 1 && srcWords.length === 1 && dbWords.length === 1);
      });
      if (bestMatch && (Math.abs(bestMatch.name.length - dbItem.name.length) < 10)) {
        match = bestMatch;
      }
    }

    if (match && match.description) {
      // Update the database
      await prisma.menuItem.update({
        where: { id: dbItem.id },
        data: { description: match.description }
      });
      matched.push({ dbName: dbItem.name, srcName: match.name, desc: match.description });
      
      // Check for claims
      const descLower = match.description.toLowerCase();
      const claimsFound = CLAIM_KEYWORDS.filter(k => descLower.includes(k));
      if (claimsFound.length > 0) {
        claimsReview.push({ item: dbItem.name, claims: claimsFound, desc: match.description });
      }
    } else {
      unmatched.push(dbItem.name);
    }
  }

  console.log('\n--- MATCHED ITEMS ---');
  matched.forEach(m => console.log(`[✓] ${m.dbName} -> ${m.srcName}`));
  
  console.log('\n--- UNMATCHED / AMBIGUOUS ITEMS ---');
  unmatched.forEach(u => console.log(`[?] ${u}`));
  
  console.log('\n--- CLAIMS TO REVIEW ---');
  claimsReview.forEach(c => console.log(`[!] ${c.item}: Found potential claims [${c.claims.join(', ')}]`));
}

updateDescriptions()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
