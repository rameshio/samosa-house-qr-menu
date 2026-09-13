# Samosa House Current Audit Report

**Date:** September 13, 2026
**Scope:** Read-only inspection of source code, Git state, database state, and deployment status.

---

## 1. CURRENT CODE AND GIT

**Branch & Commits**
- **Current Branch:** `feature/redesign-ui` (matches `origin/feature/redesign-ui`)
- **Latest Commits (top 5):**
  - `26e4ba1` fix: configure Vercel deployment for client + database-free menu API
  - `8c49217` fix: repair menu data loading and recover corrupted ERROR_LOG.md
  - `7141c9d` Fix vitest cache path, MenuPage error fallback, and clear fetchMenu mocks
  - `e16d0df` feat: complete UI redesign phase with interactive navigation and responsive layout
  - `b9be49d` feat: implement interactive mesh-gradient card borders and fix category nav initialization

**Git Status**
- **Uncommitted Changes:** `M .gitignore` (line ending warnings).
- **Untracked Files:** `awesome-design-md/` directory.
- **Local vs Pushed:** All work is pushed. The local `feature/redesign-ui` is fully synced with origin.
- **Recent Infrastructure Changes:** The most recent commit (`26e4ba1`) introduced a Vercel-specific serverless function (`api/menu.js`) that deliberately bypasses the database to serve a static JSON file. `Dockerfile` was also added recently for preview packaging.

**AGENTS.md Directives**
- Emphasizes small, explained phases.
- Mandates checking existing code before changing.
- Requires user approval between phases (never silently continue).
- Strictly bans exposing secrets and requires `.env` usage.

---

## 2. ACTUAL ARCHITECTURE

**Competing Sources of Truth**
The application currently suffers from a split-brain architecture regarding its data sources.
- **Public Workflow (Vercel):** The Vercel deployment is configured via `vercel.json` to route `/api/menu` to a serverless function (`api/menu.js`). This function bypasses the Express backend entirely and serves a static JSON file (`server/data/menu.json`).
- **Admin Workflow (Express):** Admin edits hit the Express backend (`server/src/routes/adminMenuRoutes.js`), which reads and writes to a database via Prisma. 

**Database Identity**
- Public and admin do **not** use the same database. Public sees the static `menu.json`, while admin edits are saved to an SQLite database.
- Although `docker-compose.yml` spins up a PostgreSQL container (`samosa-house-db`), the Prisma schema (`server/prisma/schema.prisma`) is hardcoded to `provider = "sqlite"`.

**Execution Environments**
- **React Frontend:** Built statically via Vite (`client/dist`). Served by Vercel in production or Express statically.
- **Express/API:** Node.js backend located in `server/`.
- **Database:** Local SQLite file (`server/prisma/dev.db`). The Docker Postgres is running but ignored.
- **Image Storage:** Uploaded directly to the local disk at `client/public/uploads` via Multer.
- **Auth/Session:** Stored in the SQLite database (`Session` table).

---

## 3. DEPLOYMENT STATUS

**Configuration**
- `vercel.json` dictates building the frontend and running serverless functions from `/api`.
- `Dockerfile` defines a 3-stage build packaging both the client and the Express backend into a single Node.js container exposing port 8080.
- No Railway configuration was found.

**Live Checks**
- **Vercel URL:** `https://samosa-house-qr-menu.vercel.app/`
- **Status:** **404 NOT_FOUND**. Both the root URL `/` and the API `/api/menu` return Vercel 404 errors. 
- **Reason:** The Vercel project is either deleted, the domain is unmapped, or a deployment never successfully built. 
- **Required Env Vars (if it were running):** `DATABASE_URL`, `SESSION_SECRET`, `PORT`, `NODE_ENV`.

*Note: If Vercel access is required, please provide the latest Vercel build logs or deployment dashboard status.*

---

## 4. DATA AND IMAGE PRESERVATION

Using read-only database queries directly against the local SQLite database (`server/prisma/dev.db`):

- **Docker PostgreSQL:** The container `samosa-house-db` exists and has been running for 11 hours, but is not receiving data.
- **Active Database:** Admin edits reside in SQLite (`dev.db`).
- **Data Counts:** 
  - **Categories:** 8
  - **Menu Items:** 46
  - **Unpublished Drafts:** 0
- **Cloud Migrations:** No data or images have been migrated to hosted services (S3/Cloudinary/managed Postgres). 
- **Image Storage:** Uploaded images are physically stored in `client/public/uploads` (3 `.webp` files currently exist).
- **Backups:** A `/backups` directory exists with `samosa_house-20260912-215146.dump` and `.sql` (approx 19KB each).

---

## 5. BROWSER AND API CHECKS

- **Status:** **BLOCKED**
- **Reason:** The public Vercel deployment returns 404. Locally, no services are running (ports 3000, 8080, and 5173 are closed). I did not start the services to strictly adhere to the read-only, non-mutating audit constraints.

---

## 6. PREVIOUS DEFECTS VERIFICATION

| Defect | Status | Evidence in Code |
| :--- | :--- | :--- |
| **Upload paths depending on `process.cwd()`** | **Fixed** | `server/src/app.js` now dynamically resolves using `path.join(__dirname, '../../client/public/uploads')`. |
| **`/uploads` paths rejected by validation** | **Fixed** | `server/src/validators/menuValidator.js` explicitly permits `item.image.startsWith('/uploads/')`. |
| **Draft image copied incorrectly on Publish** | **Fixed** | `server/src/controllers/adminMenuController.js` correctly falls back: `imageUrl: item.draftImageUrl ?? item.imageUrl`. |
| **Repeated Auth Redirects** | **Blocked** | Could not test runtime behavior due to app being offline. |
| **Missing concurrency checks** | **Fixed** | `updateMenuItem` checks `if (item.version !== version) return 409` and increments version on save. |
| **Production uploads on local disk** | **Broken** | `server/src/routes/uploadRoutes.js` and `app.js` still point to local filesystem. This is fatal in serverless/Vercel. |

---

## 7. EVIDENCE AND NEXT STEPS

**State Summary**
- **Confirmed Working:** Local draft/publish logic, concurrency checks, Prisma SQLite integration.
- **Confirmed Broken:** Vercel deployment (returns 404). Image uploads in production (still using ephemeral local disk).
- **Missing:** Cloud database (using local SQLite), Cloud image storage (using local disk).
- **Blocked:** UI/Browser testing.

### Priority Fix Table

| Finding | Evidence | User Impact | Recommended Fix |
| :--- | :--- | :--- | :--- |
| **Site Offline (404)** | `curl` against Vercel URL returns 404. | Complete outage. | Check Vercel dashboard. If using Docker instead, deploy the `Dockerfile` to a persistent host (e.g., Railway/Render). |
| **Split-Brain Data** | `/api/menu.js` reads static JSON, Admin reads SQLite. | Customers will never see Admin edits. | Delete `api/menu.js`. Route all `/api` traffic to the Express backend. |
| **Ephemeral Uploads** | `app.js` uses local `client/public/uploads`. | Images uploaded in production will disappear on server restart. | Implement a minimal S3 or Cloudinary storage adapter for production. |
| **SQLite in Production** | `schema.prisma` uses SQLite provider. | Containers destroy local DB on restart. | Switch Prisma provider to `postgresql` and use the provided Docker DB for local dev. |

### Conclusion

**The main reason the app is failing:** 
The application relies on local disk storage for both the database (`dev.db`) and user uploads (`/uploads`). While the recent Vercel serverless function (`api/menu.js`) attempted to patch the public menu by hardcoding it to a JSON file, this severed the connection between Admin edits and the Public view. Furthermore, the Vercel deployment itself is currently returning a 404 error.

**Smallest Ordered Repair Plan:**
1. Switch `schema.prisma` provider to `postgresql` and wire it to a persistent database URI.
2. Replace local Multer disk storage with a cloud provider (e.g., Cloudinary or S3) to persist menu item images.
3. Remove the Vercel-specific `api/menu.js` hack and ensure all traffic is routed to the Express application.
4. Deploy using the provided `Dockerfile` to a persistent container host rather than Vercel's serverless offering, as an Express + DB + Auth architecture fits better in a persistent container.

**Final Git Status:**
```
 M .gitignore
?? awesome-design-md/
```
*(No changes were made to application state during this audit)*
