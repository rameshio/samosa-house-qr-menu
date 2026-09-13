import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SOURCE_PATH = '../samosa-content/source-menu.json';

const CLAIM_KEYWORDS = [
  'vegan', 'gluten-free', 'gf', 'dairy-free', 'nut', 'nuts', 'cashew', 'almond',
  'spicy', 'mild', 'serves', 'oz', 'fresh', 'organic', 'homemade', 'house-made',
  'halal', 'kosher', 'plant-based'
];

const EXPLICIT_MAPPING = {
  "Vegan Mango Lassi": "100% Vegan Mango Lassi",
  "Mango Lassi": "Handcrafted Mango Lassi",
  "Salt Lassi": "Salted Cumin Lassi",
  "Samosa": "Artisan Samosa",
  "Dahi Puri": "Dahi Sev Puri",
  "Paper Dosa": "Crispy Paper Dosa",
  "Masala Dosa": "Classic Masala Dosa",
  "Idli Vada Plate": "Idli Wada Combo Plate",
  "Rose Milk": "Royal Rose Milk",
  "Sweet Lassi": "Sweet Cardamom Lassi",
  "Tomato Chilli Uttapam": "Tomato Cilantro Uttapam",
  "3 Item Combo W/White Rice": "3-Item Combo (White Basmati)",
  "3 Item Combo W/Brown Rice": "3-Item Combo (Brown Basmati)",
  "Samosa Chaat": "Signature Samosa Chaat",
  "Pani Puri": "Pani Puri (Gol Gappa)",
  "Vada Pav": "Original Wada Pav",
  "Veg Biryani": "Royal Vegetable Biryani",
  "Chai - Small": "Fresh Masala Chai (Small)",
  "Chai - Large": "Fresh Masala Chai (Large)",
  "Dhokla": "Steamed Dhokla",
  "Paratha Of The Day": "Stuffed Griddle Paratha",
  "Veg Burger": "Desi Veggie Burger",
  "Kachori": "Khasta Dal Kachori"
};

async function run() {
  const sourceRaw = fs.readFileSync(SOURCE_PATH, 'utf8');
  const sourceData = JSON.parse(sourceRaw);
  
  const sourceItems = [];
  sourceData.menu.forEach(cat => cat.items.forEach(item => sourceItems.push(item)));

  const dbItems = await prisma.menuItem.findMany();
  
  const table = [];
  
  for (const dbItem of dbItems) {
    let match = null;
    let reasoning = "";

    // 1. Explicit mapping
    if (EXPLICIT_MAPPING[dbItem.name]) {
      match = sourceItems.find(src => src.name === EXPLICIT_MAPPING[dbItem.name]);
      reasoning = "Explicit dish identity match";
    }
    
    // 2. Exact match
    if (!match) {
      match = sourceItems.find(src => src.name.toLowerCase() === dbItem.name.toLowerCase());
      if (match) reasoning = "Exact name match";
    }

    if (match && match.description) {
      // Update DB safely
      await prisma.menuItem.update({
        where: { id: dbItem.id },
        data: { description: match.description }
      });
      
      const descLower = match.description.toLowerCase();
      const claimsFound = CLAIM_KEYWORDS.filter(k => descLower.includes(k));
      
      table.push({
        existingItem: dbItem.name,
        sourceItem: match.name,
        description: match.description,
        reasoning,
        claims: claimsFound.length > 0 ? claimsFound.join(', ') : 'None'
      });
    }
  }

  // Generate Markdown Table
  console.log('| Existing item | Source item | Description | Match reasoning | Claims needing confirmation |');
  console.log('|---|---|---|---|---|');
  table.forEach(row => {
    // Escape pipes for markdown
    const desc = row.description.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    console.log(`| ${row.existingItem} | ${row.sourceItem} | ${desc} | ${row.reasoning} | ${row.claims} |`);
  });
}

run().catch(console.error).finally(() => prisma.$disconnect());
