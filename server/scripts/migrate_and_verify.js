import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sqliteData = JSON.parse(fs.readFileSync('sqlite_dump.json', 'utf8'));
  const pgUsers = JSON.parse(fs.readFileSync('old_pg_users.json', 'utf16le').replace(/^\uFEFF/, ''));
  const pgAudit = JSON.parse(fs.readFileSync('old_pg_audit.json', 'utf16le').replace(/^\uFEFF/, ''));

  const parseArr = (str) => {
    try {
      const arr = JSON.parse(str);
      if (Array.isArray(arr)) return arr;
    } catch {}
    return [];
  };

  const fixDate = (d) => d ? (d.endsWith('Z') ? d : d + 'Z') : null;

  await prisma.$transaction(async (tx) => {
    // 1. Insert original OWNER account (Skip sessions)
    for (const u of pgUsers) {
      if (u.role === 'OWNER') {
        const { id, email, displayName, passwordHash, role, isActive } = u;
        await tx.user.create({ data: { 
          id, email, displayName, passwordHash, role, isActive,
          lastLoginAt: fixDate(u.lastLoginAt), 
          createdAt: fixDate(u.createdAt), 
          updatedAt: fixDate(u.updatedAt) 
        } });
      }
    }
    console.log(`Migrated ${pgUsers.length} users from old PostgreSQL`);

    // 2. Insert Categories (SQLite)
    for (const cat of sqliteData.categories) {
      await tx.category.create({ data: cat });
    }
    console.log(`Migrated ${sqliteData.categories.length} categories from SQLite`);

    // 3. Insert Menu Items (SQLite)
    for (const item of sqliteData.menuItems) {
      const payload = {
        ...item,
        dietary: parseArr(item.dietary),
        allergens: parseArr(item.allergens)
      };
      await tx.menuItem.create({ data: payload });
    }
    console.log(`Migrated ${sqliteData.menuItems.length} menu items from SQLite`);

    // 4. Insert Audit Logs (old Postgres)
    // Only insert if the entity exists!
    let auditCount = 0;
    for (const log of pgAudit) {
      let skip = false;
      if (log.entityType === 'MenuItem' && log.entityId) {
        const exists = sqliteData.menuItems.find(m => m.id === log.entityId);
        if (!exists) skip = true;
      }
      if (!skip) {
        await tx.auditLog.create({ data: {
          ...log,
          createdAt: fixDate(log.createdAt)
        } });
        auditCount++;
      }
    }
    console.log(`Migrated ${auditCount} audit logs from old PostgreSQL`);
  });

  // Verification
  console.log('--- Verification ---');
  const pgItems = await prisma.menuItem.findMany();
  let mismatches = 0;
  for (const sl of sqliteData.menuItems) {
    const pg = pgItems.find(p => p.id === sl.id);
    const checks = [
      { field: 'name', sl: sl.name, pg: pg.name },
      { field: 'draftPriceCents', sl: sl.draftPriceCents, pg: pg.draftPriceCents },
      { field: 'version', sl: sl.version, pg: pg.version },
      { field: 'hasDraftChanges', sl: sl.hasDraftChanges, pg: pg.hasDraftChanges },
      { field: 'categoryId', sl: sl.categoryId, pg: pg.categoryId },
      { field: 'dietary', sl: JSON.stringify(parseArr(sl.dietary)), pg: JSON.stringify(pg.dietary) },
      { field: 'allergens', sl: JSON.stringify(parseArr(sl.allergens)), pg: JSON.stringify(pg.allergens) }
    ];
    for (const c of checks) {
      if (c.sl !== c.pg) {
        console.error(`Mismatch on ${sl.id} [${c.field}]: SQLite=${c.sl}, PG=${c.pg}`);
        mismatches++;
      }
    }
  }
  if (mismatches === 0) {
    console.log('All fields match exactly after type conversion!');
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
