# Changelog

## 2026-09-02 Experimental West Menu Images
- **Phase**: Experiment
- **Description**: Replaced the current menu images with WebP versions from the new `samosa-house-west-menu-images-complete` folder where a confident match was found.
- **Milestones**: 
  - Audited 52 source images and securely matched 27 items.
  - Converted confirmed matches to WebP format inside `/images/menu-west-v2/`.
  - Unmatched or ambiguous files (and duplicates) retain their existing `/images/menu/` asset paths.
- **Files Affected**: `server/data/menu.json`, `docs/WEST_MENU_IMAGE_EXPERIMENT.md`.
- **Reason**: To determine if the West Samosa House Uber Eats images provide a better visual experience without disrupting existing assets.
- **Verification**: Zero broken paths, 8 categories, 46 items correctly validated. Backend tests updated to accept the new `/images/menu-west-v2/` directory.

## 2026-09-02 Phase 8
- **Phase**: 8
- **Description**: Implemented mobile-first sticky category navigation that syncs with page scroll.
- **Milestones**:
  - Created `CategoryNavigation` component displaying horizontal category tabs.
  - Developed custom hook `useCategoryScroll` for IntersectionObserver scroll-spy logic.
  - Configured graceful fallbacks for reduced-motion and missing observer support.
  - Implemented anchor routing via ID tags and adjusted scroll margins to respect sticky header boundaries.
- **Files Affected**: `client/src/components/CategoryNavigation.jsx`, `client/src/components/MenuSection.jsx`, `client/src/pages/MenuPage.jsx`, `client/src/hooks/useCategoryScroll.js`, `client/tests/CategoryNavigation.test.jsx`.
- **Reason**: Enhancing user experience for rapid menu traversal.
- **Verification**: Fully tested observer callbacks, reduced motion paths, routing assertions, and accessibility bounds. All 42 client tests passing.
## 2026-09-02 Phase 7.5
- **Phase**: 7.5
- **Description**: Integrated the approved 3-second animated welcome MP4, the validated logo PNG, and safely mapped the confirmed web-optimized menu images.
- **Milestones**:
  - Automatically verified and mapped 42 exact item-to-image matches from the Wix audit to the JSON database.
  - Safely flagged duplicate images (used across multiple items by Wix) and deferred them for manual review, avoiding assumptions.
  - Refactored `LogoIntro.jsx` to render the auto-playing MP4 over a saffron background, resolving to the static transparent PNG in cases of error or `prefers-reduced-motion` settings.
  - Implemented secure backend validation allowing only localized, supported image extensions (rejecting traversal or external URLs).
  - Updated frontend to utilize `loading="lazy"` and `decoding="async"` for optimal web vitals.
- **Files Affected**: `server/data/menu.json`, `server/src/validators/menuValidator.js`, `client/src/components/LogoIntro.jsx`, `client/src/components/MenuItemCard.jsx`, `docs/IMAGE_ASSET_MAPPING.md`, plus test files.
- **Reason**: To enhance branding and verify complete adherence to asset security rules before progressing to interactive frontend phases.
- **Verification**: Frontend (30 assertions) and backend (18 assertions) pass successfully. Tested video parsing events, fallback limits, schema validation regex constraints, and lazy-loading DOM attributes. Manual visual testing pending.
- **Corrections**: Follow-up manual testing revealed missing images and skipped video playback.
  - Mobile Lifecycle Fix: Fixed an issue on mobile browsers where restoring a backgrounded tab or reviving via BFCache caused the intro screen to hang blank for 3.5 seconds. Added pageshow and isibilitychange listeners to immediately handle active sessions, implemented a 1200ms watchdog timer tied to the playing event to forcefully fail-fast if playback hangs.\n  - Visual Double-Intro Fix: Removed the poster and static logo fallback from the default video playback path. The intro overlay now remains completely transparent (opacity-0 pointer-events-none) leaving the menu visible and interactive until the exact moment the video fires playing. This avoids a duplicate flash of the logo before the MP4 logo begins. 
  - Image Fix 1: Mapped `dahi-puri.webp`, `3-item-combo-white-rice.webp`, and `veg-biryani.webp` explicitly despite them being intentional source-site duplicates.
  - Video Fix: Video failed to play due to the old `sessionStorage` flag (`samosa-house-intro-seen: true`) and browser caching of identical filenames.
    - Verified source: `Poject files/Samosa-House-Welcome-Unique-3s.mp4` (Duration: 3s, Res: 1080x1920).
    - SHA-256 hashes matched (`CF09EA16C189DBB3F0494303BB73B839D54C4CE3D00FC66846ABDF462A15C1CD`).
    - Renamed destination path to `/videos/samosa-house-welcome-unique-3s-v2.mp4`.
    - Implemented new cache-busting session key `samosa-house-intro-seen-v2`.
  - Image Fix 2: Mapped the final missing image `dahi-wada.webp`. It uses the same source image as Dahi Puri, intentionally duplicated by the source site. Verified the physical files and all 46 paths in the test suite.
  - Video Fix 2 (React Context): Video playback rejected inside React due to `autoPlay` attribute failure and React Strict Mode. Rewrote `LogoIntro.jsx` to natively interact with the DOM using `useRef()`, specifically applying `.muted`, `.playsInline`, and resolving the `video.play()` promise. Gracefully ignored `AbortError` triggers from React Strict Mode.
  - Verification 2: All tests (33 frontend, 18 backend) pass. Zero lint warnings.
  - Update: Removed the explicit "Skip Intro" button per request. The video now solely delegates intro completion to the native `ended` media event and emergency fallback timeout.
  - Verification 3: All tests (32 frontend, 18 backend) pass. Zero lint warnings.

## 2026-09-02 Phase 7
- **Phase**: 7
- **Description**: Implemented the Menu API and JSON data flow. Extracted catering menu data from PDF to populate `server/data/menu.json`. Conducted a data-safety correction to correctly handle missing prices as nullable integers with `priceStatus`, added catering menu metadata headers, and updated frontend formatting to display "Price unavailable" explicitly to prevent "$0.00" confusion. Later, replaced the active menu with a 46-item restaurant dataset derived from the September 2026 Wix audit. The catering menu was safely archived.
- **Milestones**:
  - Integrated `samosa-house-logo.png` into the frontend (`LogoIntro` and `Header`), replacing the failed JPEG integration to ensure transparency.
  - Switched the active backend menu from catering to the audited 46-item restaurant prototype.
  - Represented unconfirmed Wix prices in cents with `priceStatus: "needs-confirmation"`.
  - Updated tests, documentation, and archival records.
- **Files Affected**: Created `server/data/menu.json`, backend `menuRoutes.js`, `menuController.js`, `menuRepository.js`, `menuValidator.js`. Removed `placeholderMenu.js`. Created `menuService.js` and `formatters.js`. Updated `MenuPage.jsx` and `MenuItemCard.jsx`.
- **Reason**: To serve a structured, versioned, and validated menu dataset from the backend, cleanly handle asynchronous fetching, correctly parse missing pricing safely without defaulting to zero, and strictly label provisional catering data.
- **Verification**: Created and ran backend (12 assertions) and frontend (28 tests) automated tests covering valid parsing, null price fallback display ("Price unavailable"), schema validations, network failures, retry behaviors, and empty menu states. Passed linting and build.
## 2026-09-02 Phase 6
- **Phase**: 6
- **Description**: Replaced temporary setup screen with a basic mobile-first menu shell. Built reusable components including `Header`, `LocationDisplay`, `MenuItemCard`, `MenuSection`, `DietaryBadge`, `DevelopmentStatus`, and `Footer`.
- **Files Affected**: Created `client/src/components/*` and `client/src/pages/MenuPage.jsx`. Added placeholder data in `client/src/mocks/placeholderMenu.js`.
- **Reason**: To transition the frontend into the actual customer-facing interface, ensuring responsive design and accessible HTML markup before fetching live data.
- **Verification**: Created and ran automated tests for all components (25 tests total). Checked for mobile width fit, accessibility constraints, and Dev-only rendering of technical components. Lint and build successful. Manual desktop and mobile testing passed successfully (layout, fallbacks, and backend connection).
## 2026-09-02 Phase 5
- **Phase**: 5
- **Description**: Implemented a two-second logo intro animation component. Completed a quality pass to fix total timing (1700ms display + 300ms fade) and comprehensively test 10 accessibility, storage, and duration requirements.
- **Files Affected**: `client/src/components/LogoIntro.jsx`, `client/tests/LogoIntro.test.jsx`, `client/src/App.jsx`, `docs/*`.
- **Reason**: To fulfill the exactly two-second brand intro overlay requirement before revealing the menu, strictly adhering to reduced-motion and storage fallback logic.
- **Verification**: Mapped and executed 10 explicit frontend automated tests covering fresh sessions, exact timings, unmount behavior, and storage failures. Passed 15 frontend tests total. Linting and building passed cleanly. Manual visual testing passed successfully (intro appeared and animation effect was visible).
## 2026-09-02 Phase 4
- **Phase**: 4
- **Description**: Connected React frontend to Node.js backend. Conducted a quality pass to improve test coverage, DOM accessibility for error states, and remove all linting warnings.
- **Files Affected**: `client/src/services/*`, `client/src/components/ApiStatusCard.jsx`, `client/tests/ApiStatusCard.test.jsx`, `server/src/middleware/*`, `server/eslint.config.js`, `docs/*`.
- **Reason**: To verify full-stack communication, establish API client architecture, and maintain zero-warning linting standards.
- **Verification**: Ran backend (`npm test`, `npm run lint`) and frontend (`npm test`, `npm run lint`, `npm run build`). Passed 5 frontend tests and 2 backend tests. Checked zero lint warnings across both workspaces. Manual connection and recovery testing passed successfully.

## 2026-09-02 Phase 3
- **Phase**: 3
- **Description**: Initialized Node.js backend with Express. Created health endpoint and unified error handling.
- **Files Affected**: `server/*`, `docs/*`.
- **Reason**: To set up API structure and routing.
- **Verification**: Ran tests `npm test`, linted via ESLint, manually tested endpoints with curl.

## 2026-09-02 Phase 2
- **Phase**: 2
- **Description**: Initialized React frontend with Vite and configured Tailwind CSS v4. Created minimal structure and temporary verification screen.
- **Files Affected**: `client/package.json`, `client/vite.config.js`, `client/src/App.jsx`, `client/src/main.jsx`, `client/src/styles/global.css`.
- **Reason**: To set up the frontend tooling and a provisional styling foundation.
- **Verification**: Ran `npm install`, built successfully, passed linting, and verified development server responds correctly.

## 2026-09-02 Phase 1
- **Phase**: 1
- **Description**: Project foundation and folder structure created.
- **Files Affected**: `README.md`, `AGENTS.md`, `.gitignore`, `.editorconfig`, `.vscode/*`, `docs/*`.
- **Reason**: To establish a solid foundation and clear documentation structure before writing code.
- **Verification**: Manually verified file existence and directory layout.
