# Samosa House QR Menu & Website

A modern, mobile-first website and QR menu system for Samosa House.

## Project Purpose
When a customer scans a location-specific QR code, they see a two-second animated intro before revealing the specific location's menu. The menu system supports multiple locations, categorizations, dietary filters, and location-specific ordering links.

## Architecture
- **Frontend**: React.js with Vite, Tailwind CSS
- **Backend**: Node.js with Express.js
- **Data**: Structured JSON files

## Documentation
Please refer to the `docs/` folder for comprehensive documentation on all aspects of the project. Start with `docs/PROJECT_STATUS.md` and `docs/SETUP_GUIDE.md`.

> [!WARNING]
> The current JSON menu dataset (`server/data/menu.json`) was extracted from a Wix restaurant website audit and is strictly **provisional** as a prototype. Prices are unconfirmed (`needs-confirmation`) due to conflicts between the Wix site and Clover catalogs. It must not be treated as the confirmed regular dine-in menu without explicit client approval.
