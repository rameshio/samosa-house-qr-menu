import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { getMenuData } from '../src/repositories/menuRepository.js';

const prisma = new PrismaClient();

async function exportStaticMenu() {
  const menuData = await getMenuData();
  
  // Write to client/public/menu.json
  const outputPath = '../client/public/menu.json';
  fs.writeFileSync(outputPath, JSON.stringify({ success: true, data: menuData }, null, 2));
  
  console.log('Exported published menu to menu.json');
  console.log('Validating images...');
  
  const missing = [];
  for (const cat of menuData.categories) {
    for (const item of cat.items) {
      if (item.imageUrl) {
        // Assume imageUrl starts with / (e.g. /images/... or /uploads/...)
        const relativePath = `../client/public${item.imageUrl}`;
        if (!fs.existsSync(relativePath)) {
          missing.push(item.imageUrl);
        }
      }
    }
  }
  
  if (missing.length > 0) {
    console.error('Missing images:', missing);
  } else {
    console.log('All referenced images exist in client/public.');
  }
}

exportStaticMenu().catch(console.error).finally(() => prisma.$disconnect());
