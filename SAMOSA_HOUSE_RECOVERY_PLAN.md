# Samosa House Data Recovery & Architecture Repair Plan

**Date:** September 13, 2026
**Status:** Backups Completed and Verified.

---

## 1. Verified Database Status (Latest Data)

**Finding:** The **SQLite** database (`server/prisma/dev.db`) contains the latest authoritative edits.

**Evidence:**
- Maximum `updatedAt` for `MenuItem` in PostgreSQL: `2026-09-09 16:33:46.948` (4 days ago).
- Maximum `updatedAt` for `MenuItem` in SQLite: `2026-09-13T02:15:42.222Z` (Today).
- A git commit on September 12 by Ramesh (`8c49217`) explicitly states: *"Switch Prisma datasource to SQLite for local dev (Postgres/Docker not available)"*.

**Backups Created (Locally, Gitignored):**
- **SQLite:** `backups/sqlite_dev_20260913.db` (Verified size: ~82KB).
- **PostgreSQL:** `backups/pg_backup_20260913.dump` (Verified pg_dump export).
- **Images:** `backups/uploads_backup_20260913.zip` (Contains the 3 uploaded `.webp` drafts).

*Note: The `imageUrl` values in SQLite currently point to the static seeded images (e.g., `/images/menu-west-v2/samosa.webp`). The uploaded images in `/uploads` do not currently have active references in the published SQLite dataset, meaning they were either drafts that were overwritten or abandoned.*

---

## 2. Architectural Changes from PostgreSQL to SQLite

When the database was switched to SQLite (Commit `8c49217`), several database-level downgrades occurred because SQLite lacks advanced data types:
1. **Provider Changed:** `provider = "postgresql"` became `provider = "sqlite"`.
2. **Enums Removed:** The `Role` enum (OWNER, STAFF) was converted to a plain `String`.
3. **Arrays Flattened:** PostgreSQL scalar arrays (`String[]`) for `dietary` and `allergens` were converted to plain strings with a default of `"[]"`. The application code (`menuRepository.js`) was altered to `JSON.parse` and `JSON.stringify` these fields manually.

---

## 3. Concrete Plan for a Shared Data Source

Currently, public users hit `api/menu.js` (which serves a static `menu.json`), while admins edit the SQLite database. To fix this split-brain issue:

1. **Delete `api/menu.js`:** Remove the Vercel serverless function hack.
2. **Unify the API:** Route all public `/api/menu` traffic to the Express backend (`server/src/routes/menuRoutes.js`), which already correctly queries the database.
3. **Restore PostgreSQL:** Update `schema.prisma` back to PostgreSQL.
4. **Deploy Express:** Instead of splitting the frontend to Vercel and the backend locally, deploy the provided `Dockerfile` to a persistent container service (e.g., Railway/Render) with an attached managed PostgreSQL database. Both Admin and Public frontend requests will hit this single, unified Node.js process.

---

## 4. Migration Method (SQLite to PostgreSQL)

A direct SQL dump/restore will fail due to the schema differences (Strings vs Enums, JSON Strings vs Arrays). 

**Step-by-Step Data Transfer Plan:**
1. Revert `schema.prisma` back to PostgreSQL (Restore `Role` enum and `String[]` types).
2. Generate the Prisma client and push the schema to the new PostgreSQL database (`npx prisma db push`).
3. Write a temporary Node.js ETL script (`server/scripts/migrate_sqlite_to_pg.js`):
   - Connect to the SQLite backup using `better-sqlite3`.
   - Connect to the new PostgreSQL database using the Prisma Client.
   - Loop through all `Category`, `MenuItem`, `User`, `Session`, and `AuditLog` records.
   - For each `MenuItem`, parse the JSON string arrays: `dietary: JSON.parse(row.dietary)`.
   - For each `User`, map the role string to the Postgres enum: `role: row.role === 'OWNER' ? Role.OWNER : Role.STAFF`.
   - Insert records into PostgreSQL exactly as they are (preserving all UUIDs, timestamps, versions, and draft fields).
4. Run the script once locally pointing to the production PostgreSQL URL.

---

## 5. Atomic Concurrency Enforcement

The architecture will prevent admin edit collisions using **Optimistic Concurrency Control (OCC)**, which relies on atomic database updates:

1. Every `MenuItem` has a `version Int @default(1)` field.
2. When an admin fetches a menu item to edit, they receive the current `version`.
3. When the admin clicks "Save Draft" or "Publish", the update query is executed with a strict condition: 
   `prisma.menuItem.update({ where: { id: itemId, version: submittedVersion }, data: { ...updates, version: { increment: 1 } } })`.
4. If another admin has modified the item in the interim, the `version` in the database will have incremented.
5. PostgreSQL handles this update atomically. The query will target zero rows, Prisma will throw a `RecordNotFound` exception, and the server will return `409 Conflict: Document modified by another user`, prompting the user to refresh.

---

## 6. Diagnosing the Vercel 404 Outage

The public Vercel URL is currently returning `404 NOT_FOUND` for all paths. To diagnose this, the following evidence is still required:

1. **Vercel Build Logs:** We need to verify if `npm run build --prefix client` is actually producing the `client/dist/index.html` file on Vercel's build servers.
2. **Vercel Project Configuration:** Check the Output Directory setting in the Vercel Dashboard. The `vercel.json` overrides it to `client/dist`, but if the Vercel project framework preset is overriding this, the files may be in the wrong location.
3. **Deployment Status:** Check if the deployment actually succeeded or if the domain is correctly mapped to a successful production build, rather than an abandoned preview branch.

---

## 7. Pre-Migration Verification Results

Prior to any migration, all backups and data sources were rigorously verified:

1. **SQLite Backup Integrity:** `PRAGMA integrity_check;` executed on `backups/sqlite_dev_20260913.db` successfully passed (`ok`).
2. **PostgreSQL Dump Restore Test:** The `pg_backup_20260913.dump` was safely restored into a temporary database (`samosa_house_temp_restore`) on the existing Docker container. The restore completed successfully and queries confirm all 46 legacy Menu Items are present. No data loss in the dump.
3. **Image ZIP Verification:** The `backups/uploads_backup_20260913.zip` archive was extracted to a temporary folder and successfully validated. All three uploaded `.webp` files remain intact and accessible.
4. **Image Reference Cross-Check:**
   - Queried both the authoritative SQLite database and the old PostgreSQL database.
   - **SQLite:** Zero active matches for `/uploads/` in `imageUrl` or `draftImageUrl`. The images in `/uploads` are currently unreferenced artifacts (likely abandoned drafts or orphaned files).
   - **PostgreSQL:** One legacy item (`chai-large`) referenced `/uploads/ac7a70cdfa6162a67034882fb3466c95.webp`, which no longer exists on disk.
   - **Action Taken:** All physical images in `/uploads` have been preserved safely in the backup ZIP regardless of their current database linkage. No images have been discarded.
