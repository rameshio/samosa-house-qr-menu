import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const dataPath = path.join(__dirname, '../data/menu.json');
  const fileContent = await fs.readFile(dataPath, 'utf-8');
  const menuData = JSON.parse(fileContent);

  console.log('Starting seed...');

  await prisma.$transaction(async (tx) => {
    let categoryOrder = 1;

    for (const category of menuData.categories) {
      await tx.category.upsert({
        where: { slug: category.id },
        update: {
          name: category.name,
          displayOrder: categoryOrder,
        },
        create: {
          id: category.id,
          slug: category.id,
          name: category.name,
          displayOrder: categoryOrder,
        }
      });

      let itemOrder = 1;
      for (const item of category.items) {
        await tx.menuItem.upsert({
          where: { slug: item.id },
          update: {
            categoryId: category.id,
            name: item.name,
            description: item.description || '',
            priceCents: item.basePriceCents,
            imageUrl: item.image || null,
            isAvailable: item.available !== false,
            dietary: item.dietary || [],
            spicy: !!item.spicy,
            allergens: item.allergens || [],
            displayOrder: itemOrder,
          },
          create: {
            id: item.id,
            slug: item.id,
            categoryId: category.id,
            name: item.name,
            description: item.description || '',
            priceCents: item.basePriceCents,
            imageUrl: item.image || null,
            isAvailable: item.available !== false,
            dietary: item.dietary || [],
            spicy: !!item.spicy,
            allergens: item.allergens || [],
            displayOrder: itemOrder,
          }
        });
        itemOrder++;
      }
      categoryOrder++;
    }
  });

  const categoryCount = await prisma.category.count();
  const itemCount = await prisma.menuItem.count();
  
  console.log("Seed completed successfully.");
  console.log("Total Categories: ${categoryCount}");
  console.log("Total Menu Items: ${itemCount}");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
