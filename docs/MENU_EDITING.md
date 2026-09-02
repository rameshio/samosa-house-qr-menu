# Menu Editing Guide

**History**: This document was originally created during Phase 1 as a planned guide. In Phase 6, the menu data used a static mock file at `client/src/mocks/placeholderMenu.js` to test layout.
**Phase 7 Update**: The static data has now been replaced with a dynamic API endpoint (`GET /api/menu`). The raw data is stored as JSON in `server/data/menu.json`.

## How the Layout Uses Data
The `MenuItemCard` component is fully dynamic and depends on the shape of the data:
- `name`: String
- `description`: String
- `basePriceCents`: Integer or null (e.g. `499` for $4.99). Never use floating point formats.
- `priceStatus`: String enum (`confirmed`, `needs-confirmation`, `not-provided`).
- `spicy`: Boolean
- `dietary`: Array of strings (e.g., `['vegan', 'vegetarian']`)
- `available`: Boolean
- `image`: String path (e.g. `/images/menu/samosa.webp`) or null. The backend validator strict-checks these to prevent external URLs or traversal paths. Falls back to local SVG icon on failure.
- `needsReview`: Boolean (internal flag not displayed to customers)

## Editing the Menu
Currently, you can manually edit the `server/data/menu.json` file. Ensure that all monetary values are non-negative integers (`basePriceCents`), and all IDs are lowercase kebab-case. 
Future phases will introduce admin editing interfaces.
