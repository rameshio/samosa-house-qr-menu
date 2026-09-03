# Testing Guide

## Automated Tests

### Frontend (`client/`)
- **Unit & Integration Tests**: Run `npm test` (Uses Vitest and React Testing Library).
- **Linting**: Run `npm run lint` (Uses oxlint).
- **Build Verification**: Run `npm run build` (Uses Vite build).

### Backend (`server/`)
- **Unit & Integration Tests**: Run `npm test` (Uses Node's native test runner).
- **Linting**: Run `npm run lint` (Uses ESLint).

## Manual Verification Log

- **Phase 1**: Folder structure manually verified.
- **Phase 2**: React and Tailwind visual testing passed at iPhone 16 Pro Max viewport.
- **Phase 3**: Node.js and Express backend manual testing passed via cURL.
- **Phase 4**: Frontend-to-backend connection and failure recovery manually verified in browser.
- **Phase 5**: Logo Intro two-second animation and overlay functionality manually verified.
- **Phase 6**: Mobile and desktop layout, component behavior, missing images, and unavailable items manually verified.
- **Phase 7**: Backend API integration, null price strictness, and Wix restaurant menu swap completed (manual testing pending).
- **Phase 7.5**: Asset Integration Pass integrating MP4 welcome video, validated menu images, PNG logo, Mobile Lifecycle correction, and Double-Intro Visual fix (manual retesting pending).
- **Phase 8**: Category Navigation and Sticky Menu Controls implemented and verified manually.
- **West Menu Image Experiment**: Image processing, match validation, and WebP generation completed. Backend and frontend tests pass. Manual visual review pending.


- **Footer Logo Correction**: Implemented replacing footer text with transparent logo. Manual testing pending.

## 2026-09-02 - Liquid-Glass Redesign Bugfix
- **Manual Viewport Tests**: Verified at 320px, 375px, 390px, 440px, and Desktop widths.
  - Scroll jumping eliminated during slow vertical scrolling.
  - Active categories follow cleanly without snapping document.
  - `replaceState` successfully updates hash without jump.
  - Horizontal category bar centers active items efficiently.
- **Automated Tests**: Added assertions for `scrollTo` and `replaceState`. All 48 client tests passing. All 23 server tests passing.

## 2026-09-02 - Footer Wordmark Update
- **Manual Viewport Tests**: Verified at 320px, 375px, 390px, 440px, and Desktop widths. The text wordmark scales properly (text-xl on mobile, text-2xl on desktop), remains centered, and provides high contrast against the dark navy footer without horizontal overflow or bloated spacing.
- **Automated Tests**: Updated `Footer.test.jsx` to assert the semantic text instead of the image. All client tests, linting, and build steps pass.

## 2026-09-02 - Sticky Navigation & Scroll Offset Fix
- **Manual Viewport Tests**: Verified at 320px, 375px, 390px, 440px, and Desktop widths. Header and Category Navigation correctly stack and stick to the top of the viewport. Nav opacity is readable over dark images. Clicking categories brings sections precisely below the combined sticky height without overlap (using `scroll-mt-135px` / `150px`). No upward jumping when scrolling, and horizontal categories can be touch-scrolled independently.
- **Automated Tests**: Executed client tests, lint, and build. All pass.

## 2026-09-03 - LogoIntro Initial Flash Fix
- **Manual Viewport Tests**: Verified in browser.
  - New session immediately displays the Saffron gate; no menu flash.
  - Video gracefully fades in upon playback.
  - Reduced-motion mode retains the static logo fallback.
  - Same-session refresh opens the menu instantly.
- **Automated Tests**: Updated `LogoIntro.test.jsx` to explicitly test immediate gate solidity and video opacity. 48 client tests passing. 23 server tests passing.

## 2026-09-03 - Mobile Two-Column Menu Layout
- **Manual Viewport Tests**: Verified in browser.
  - Exactly two cards appear per mobile row at 320px, 375px, 390px, 414px, and 440px.
  - Tablet/Desktop viewports dynamically expand to 3 or 4 columns gracefully.
  - No horizontal overflow exists.
  - Image paths, aspect-[4/3] containers, and object-contain properties are fully preserved without aggressive cropping.
  - Long names wrap to two lines successfully, and price wrapping prevents text overlap at 320px.
  - Existing video, observer, sticky navigation, and scroll fixes remain entirely functional.
- **Automated Tests**: Updated `MenuItemCard.test.jsx` to remove aggressive `sm:object-cover` and layout breakpoint overrides. 48 client tests passing. 23 server tests passing.

## 2026-09-03 - Category Navigation Initialization Fix
- **Manual Viewport Tests**: Verified in browser.
  - Refreshing with no hash initializes Appetizers as active immediately (orange, readable).
  - Refreshing with #category-chaat initializes Chaat as active immediately.
  - Refreshing with an invalid hash falls back to Appetizers safely.
  - Active category controls are fully clickable, keyboard-focusable, and not disabled.
  - Scrolling updates the active category correctly and does not cause vertical page jumping when returning to the top.
  - The sticky behavior and gooey animations still work.
- **Automated Tests**: Created useCategoryScroll.test.jsx to test synchronous initialization and added regression coverage in CategoryNavigation.test.jsx. 52 client tests passing. 23 server tests passing. Linter and build passed successfully.

## 2026-09-03 - Menu Card Border Glow Implementation
- **Manual Viewport Tests**: Verified in browser.
  - Hovering over a card on desktop gracefully animates a mesh-gradient border glow using the brand palette (Saffron, Gold, Ivory).
  - Reduced-motion mode accurately falls back to a static card.
  - Touch simulation safely ignores pointer-move calculations and reverts to the standard static layout, saving mobile CPU constraints.
  - Two-column alignment, image aspect ratios, and badge layouts remain entirely unshifted when hovering.
  - Keyboard focus via Tab correctly activates the border glow.
  - The decorative border resides fully behind the item content without blocking clicks or lowering text contrast.
- **Automated Tests**: Card layout and rendering tests all pass (verified image, name, price, fallback). 52 client tests passing. 23 server tests passing. Client lint and build cleanly.
