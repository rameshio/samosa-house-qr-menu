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
