# Samosa House Technical Audit Report

**Date:** September 2026
**Type:** Factual Read-Only Audit

---

## 1. PROJECT AND GIT STATE
- **Project Folder**: `c:\Users\rames\OneDrive\Desktop\Samosa House`
- **Current Branch**: `feature/redesign-ui`
- **Git Remotes**: `origin https://github.com/rameshio/samosa-house-qr-menu.git` (fetch/push)
- **Latest Commit**: `e16d0df feat: complete UI redesign phase with interactive navigation and responsive layout`
- **State Details**: 
  - The repository has **25** modified tracked files and **24** untracked files/directories.
  - **Committed vs Local**: The entire React Admin Dashboard, API client (`client/src/services/api.js`), Admin backend routes, CSRF middleware, Auth contexts, and rate limiters exist strictly as **uncommitted local modifications**. The remote branch only contains the public UI redesign.

## 2. ARCHITECTURE AND FILE MAP
- **Frontend**: React 18 (Vite), React Router v6, Tailwind CSS.
  - `client/src/App.jsx` (Routing entry point)
  - `client/src/pages/MenuPage.jsx` (Public Menu)
  - `client/src/pages/admin/*` (Admin Dashboard components)
  - `client/src/services/apiClient.js` (Public API wrapper)
  - `client/src/services/api.js` (Secure Admin API wrapper with CSRF)
- **Backend**: Express 4.21, modular routes.
  - `server/src/app.js` (Express entry point, CORS, Rate Limiters, Helmet)
  - `server/src/routes/adminMenuRoutes.js`, `authRoutes.js`, `staffRoutes.js`
- **Database**: PostgreSQL 15 (Docker) / Prisma ORM 6.0.0.
  - `server/prisma/schema.prisma` (Defines `MenuItem`, `User`, `Session`, `Category`)
- **Image Storage**: Local disk storage using `multer` for multipart parsing and `sharp` for transformation. Output to `../../client/public/uploads`.
- **Docker**: `docker-compose.yml` configures Postgres 15 mapped to `5432`.

## 3. PUBLIC MENU
- **Categories/Items**: 8 categories, 46 original menu items (*Verified in DB and `seed.js`*).
- **Data Source**: Database JSON (queried from `menuRepository.js` and served via `GET /api/menu`).
- **Response Format**: `{ success: true, data: { categories: [...] } }`.
- **Prices**: Stored safely as integer cents (`priceCents`) in the database.
- **Visual Features**: 
  - Welcome video session skip (implemented via `sessionStorage` in `LogoIntro.jsx`).
  - Mobile two-column cards (CSS Grid in `MenuSection.jsx`).
  - Mobile sticky category menu with scroll spy (implemented in `CategoryNavigation.jsx` and `useCategoryScroll.js`).
- **Availability**: Hidden tags/opacity changes applied conditionally via `isAvailable` property.

## 4. ADMIN DASHBOARD
**Implemented & Verified:**
- Login/Logout (`AdminLogin.jsx`, `authController.js`).
- Session restoration (Cookie-based, validated via `/api/admin/auth/me`).
- Dashboard UI with filters (`AdminDashboard.jsx`).
- Create/Edit Item forms (`AdminMenuEditor.jsx`).
- Image Upload (Intercepts via `URL.createObjectURL` for immediate preview).
- Save Draft (Isolates edits strictly to `draft*` DB columns).
- Publish (Atomically copies `draft*` to public columns).
- Availability toggling (Optimistic UI updates).
- Audit History (`AdminAudit.jsx` rendering `auditLog` from DB).

**Missing or Incomplete:**
- **Draft Preview Page:** *Missing*. Edits can be seen in the editor's image preview, but there is no dedicated "Draft Preview" rendering the public menu with draft values.
- **Archive:** *Missing*. No UI component exists to archive an item.
- **Staff Account Creation:** *Missing*. `AdminStaff.jsx` lists staff and toggles them, but contains no form to *create* a new staff member.
- **Password Reset:** *Missing*. No endpoints or UI.
- **Unsaved-change warning:** *Missing*. Navigating away from `AdminMenuEditor.jsx` does not warn the user.
- **HTTP 409 Conflict Recovery:** *Partially implemented*. The API throws a conflict error, but the UI has no diff-merge recovery flow.

**Permissions Enforcement**: `requireOwner` middleware in `authMiddleware.js` successfully isolates staff endpoints on the backend. `ProtectedRoute.jsx` securely isolates the React router.

## 5. OWNER LOGIN SETUP
- **Location**: `server/scripts/bootstrap-owner.js`.
- **Execution**: `cd server && node scripts/bootstrap-owner.js`
- **Environment**: Reads `BOOTSTRAP_OWNER_EMAIL` and `BOOTSTRAP_OWNER_NAME`. Does *not* automatically invoke `dotenv` inside the script, relying on runtime environments or Prisma's internal load.
- **Interactivity**: Prompts for password via `readline.question`. **Password entry is NOT hidden** (plain text).
- **Idempotency**: Safely exits with code 0 if an owner already exists.
- **Current State**: A user with role `OWNER` (`admin@example.com`) is **confirmed to exist** in the active local database.

## 6. AUTHENTICATION AND SECURITY
- **Password Hashing**: Secure. Uses `crypto.scrypt` with a 16-byte random salt and 64-byte derived key (`authService.js:11`).
- **Sessions**: Database-backed `Session` table. Uses 32-byte opaque hex tokens. Revocation handled properly (`authController.js`).
- **Cookies**: `httpOnly: true`, `sameSite: 'lax'`, `path: '/api/admin'`.
- **CSRF**: Double-submit cookie securely implemented natively in `csrfMiddleware.js`. 
- **Rate Limiters**: Safely isolated (`rateLimiters.js`):
  - Login: 5 req / 15m.
  - Uploads: 20 req / 15m.
  - General: 1000 req / 15m (Dev), 100 req (Prod).
- **Security Headers**: `helmet()` initialized in `app.js`.
- **File Validation**: `multer` restricts sizes to 5MB; `sharp` forcibly processes images to WebP, stripping malicious EXIF data (`storageService.js`).
- **Final Owner Protection**: Secure. `staffController.js:37` blocks disabling the final active OWNER.

## 7. DRAFT/PUBLISH AND DATABASE
- **Draft Fields**: `MenuItem` schema includes `draftName`, `draftDescription`, `draftPriceCents`, `draftImageUrl`, and `hasDraftChanges`.
- **Separation**: "Save Draft" updates *only* draft fields (`adminMenuController.js:14`), preserving the public API safely.
- **Publishing**: `POST /api/admin/menu/publish` overwrites public fields with draft fields natively.
- **Idempotency**: `prisma/seed.js` uses `upsert` uniquely keyed to prevent duplicate categories/items.
- **Gaps**: Replaced draft images are orphaned on the disk (not deleted from `/uploads`). No optimistic concurrency check exists for concurrent editing.

## 8. RECENT 429 AND 401 BEHAVIOR
**The infinite request loop is CONFIRMED FIXED.**
- **Root Cause**: Previously, `App.jsx` wrapped the entire public app in `<AuthProvider>`. Unauthenticated visitors received a 401 from `/api/admin/auth/me`, triggering a blind `window.location.href = '/admin/login'` redirect in `api.js`, which continuously reloaded the app, immediately exhausting the rate limiter.
- **Fixes Applied**:
  - `AuthProvider` moved securely inside the `/admin/*` router subtree (`App.jsx`).
  - `api.js` CSRF cache implemented and recursive redirects blocked.
  - `app.set('trust proxy', 1)` added to `app.js` to prevent Vite from collapsing all IPs into a single localhost identity.
- **401 on Admin Login**: Expected behavior. Initializing the `/admin/login` page naturally checks `/api/admin/auth/me` to determine if a session already exists. The resulting 401 correctly unlocks the login form.

## 9. VERIFICATION EVIDENCE
- **Test Totals**: **31 Backend Tests Passing** (`server/tests/**/*.test.js`). Includes new tests proving IP isolation for the `loginLimiter` using `X-Forwarded-For`.
- **Client Tests**: Mock-based tests added (`MenuPageRequests.test.jsx`) verifying exact request boundaries. 
- **Execution Date**: Verified locally within this session via `npm run test` (Sep 2026).
- **Browser Execution**: Public menu renders, fetching `/api/menu` exactly once.

## 10. GAPS AND NEXT STEPS

| Finding | Severity | Source | User Impact | Recommended Action |
| :--- | :--- | :--- | :--- | :--- |
| **Missing Staff Creation Form** | High | `AdminStaff.jsx` | Owners cannot invite new staff members, completely halting onboarding. | Build a `CreateStaffModal` inside `AdminStaff.jsx`. |
| **Missing Draft Preview UI** | Medium | `AdminMenuEditor.jsx` | Users cannot preview how a draft looks in the public layout before publishing. | Implement a `?preview=true` toggle on the public menu that overrides data with draft fields. |
| **Missing Password Reset** | Medium | N/A | Users locked out cannot recover accounts. | Build a secure password reset flow or CLI command. |
| **Missing Archive UI** | Low | `AdminDashboard.jsx` | Items cannot be soft-deleted. | Add an "Archive" button to the Dashboard item rows. |
| **Orphaned Image Files** | Low | `adminMenuController.js` | Disk space slowly fills with replaced draft images. | Implement an `fs.unlink` cleanup routine upon successful replacement. |
| **Unmasked CLI Password** | Low | `bootstrap-owner.js` | Password is typed in plain text. | Replace `readline.question` with a masked prompt library. |

### Final Summary
- **Complete**: The foundational UI redesign, backend authentication, CSRF protections, draft/publish schema, rate limiters, and the core Admin components (Login, Dashboard, Editor).
- **Unfinished**: Staff creation forms, full Draft Previews, and Archiving.
- **Blocks to Owner Login**: None. The account `admin@example.com` exists and login is stable.
- **Pre-Commit Checks**: Address the missing Staff Creation form, as a dashboard without the ability to invite staff is functionally incomplete for management.
- **Startup Commands**:
  ```bash
  cd server && docker-compose up -d
  npx prisma db push
  npm run dev
  # Separate terminal
  cd client && npm run dev
  ```
