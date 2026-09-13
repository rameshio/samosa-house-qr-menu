import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function backup() {
  const items = await prisma.menuItem.findMany();
  fs.writeFileSync('server/backups/descriptions_backup.json', JSON.stringify(items, null, 2));
  console.log('Backed up current descriptions to server/backups/descriptions_backup.json');
}

backup().catch(console.error).finally(() => prisma.$disconnect());
