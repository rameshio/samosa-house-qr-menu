# Project Structure

```text
/
├── client/         # React frontend 
│   ├── public/
│   │   ├── images/ # Static public assets and brand logos
│   │   └── videos/ # Static video assets
│   ├── src/
│   │   ├── assets/     # Imported static images and icons
│   │   ├── components/ # Reusable React components (e.g. MenuItemCard)
│   │   ├── hooks/      # Custom React hooks (e.g. useCategoryScroll.js)
│   │   ├── pages/      # Page-level components
│   │   ├── services/   # API fetching services (e.g. menuService.js)
│   │   ├── utils/      # Utility helpers (e.g. formatters.js)
│   │   └── styles/     # Global CSS and Tailwind configuration
│   └── tests/      # Frontend tests (Vitest + RTL)
├── server/         # Node.js and Express backend
│   ├── src/
│   │   ├── controllers/ # Route handlers (e.g. menuController.js)
│   │   ├── middleware/  # Express middleware (e.g. error handlers)
│   │   ├── repositories/# Data access layer (e.g. menuRepository.js)
│   │   ├── routes/      # Express routing (e.g. menuRoutes.js)
│   │   └── validators/  # JSON validation logic (e.g. menuValidator.js)
│   ├── data/       
│   │   ├── archive/     # Archival datasets (e.g. catering-menu-draft.json)
│   │   └── menu.json    # Active menu dataset
│   └── tests/      # Backend tests
├── docs/           # All project documentation
├── .vscode/        # VS Code settings and recommended extensions
├── README.md       # Primary project guide
└── AGENTS.md       # Instructions for future AI coding agents
```

## Folder Responsibilities
- **`client/`**: Handles all user interface rendering, state management, API fetching logic, and interactions.
- **`server/`**: Serves the API, handles business logic, implements schema validation, and supplies menu data.
- **`server/data/`**: Stores strict, versioned JSON files for menus and locations.
- **`docs/`**: Holds markdown files describing architecture, setup, logs, decisions, and processes.
