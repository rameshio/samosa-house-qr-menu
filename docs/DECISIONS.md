# Architecture & Design Decisions

## 2026-09-02: Tailwind CSS v4 Configuration
**Decision**: Use Tailwind CSS v4 with its new CSS-first configuration via `@theme` inside `global.css` and the `@tailwindcss/vite` plugin.
**Reason**: Tailwind v4 is the current standard and recommends moving away from `tailwind.config.js`. This ensures the project remains modern and easier to maintain without legacy configuration files.
**Impact**: Brand tokens and styling rules are managed in `client/src/styles/global.css`.

## 2026-09-02: Pricing and Data Modeling
**Decision**: Represent monetary values exclusively as integer cents (`basePriceCents`), handle unknown prices with explicit `null` and a `priceStatus` enum, and mark the catering dataset as `draft`/`provisional`.
**Reason**: 
- *Why integer cents?* Floating-point numbers are imprecise in JSON and JavaScript (e.g., `0.1 + 0.2`). Storing currency as integers prevents rounding bugs during future cart or checkout processing.
- *Why null instead of zero?* Representing an unknown price as `$0.00` is dangerously misleading and can trick customers into assuming an item is free. Using `null` enforces strict fallback text ("Price unavailable").
- *Why priceStatus?* A `null` price could mean "free", "TBD", or "unavailable". Supplying an explicit enum (`confirmed`, `needs-confirmation`, `not-provided`) strictly couples the value with its intent.
- *Why draft/provisional?* The data was extracted from a PDF catering menu. It should not be presented or conflated as the official live dine-in menu without explicit client review and confirmation.
**Impact**: Menu JSON structure is safer; the frontend strictly types and displays fallbacks over zeros.

## 2026-09-02: Wix vs Clover Menu Source
**Decision**: The active frontend menu (`/api/menu`) currently consumes the 46-item Wix website audit dataset instead of the larger 115-item Clover catalog. All prices remain flagged as `needs-confirmation`.
**Reason**: 
- *Why Wix over Clover?* We are prototyping the visual menu shell. The Wix data size (46 items) is a manageable baseline compared to the sprawling 115-item Clover database.
- *Why unconfirmed prices?* The audit identified severe pricing conflicts between Wix and Clover (e.g. Wix lists items significantly cheaper). We must not present these prices as authoritative without explicit client reconciliation.
- *What about the catering data?* The previous 47-item catering menu is preserved in `server/data/archive/catering-menu-draft.json` for safety.
**Impact**: The frontend now safely surfaces unconfirmed Wix prices but actively warns users that they are provisional and subject to change by location.
