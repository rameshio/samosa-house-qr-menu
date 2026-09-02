# Architecture

## Tech Stack
**Frontend**: React (Vite) + Tailwind CSS v4
**Backend**: Node.js + Express
**Data**: File-based JSON (e.g., `server/data/menu.json` which prototypes an audited Wix restaurant menu, alongside archival datasets in `server/data/archive/`).

## Communication
The frontend communicates with the backend via REST APIs (e.g., `GET /api/menu`). The backend securely validates the structured JSON and returns it to the client.

## Development Diagnostics
Technical backend diagnostics and API status cards are rendered conditionally using Vite's development mode flag (`import.meta.env.DEV`), not merely by checking whether the hostname is localhost. This ensures they are safely stripped during a production build.

## Frontend Tooling
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4 (using CSS-first `@theme` configuration in `global.css`)
- **Linter**: oxlint
- **Tests**: Vitest & React Testing Library
