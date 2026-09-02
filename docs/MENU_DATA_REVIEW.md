# Menu Data Review

## Source Details
- **Active Source**: September 2, 2026 Wix website audit (`Poject files/samosa-house-website-audit.md`)
- **Status**: The active dataset is a restaurant menu prototype.
- **Categories Found**: 8 (Appetizers, Chaat, Combination Plates, Small Plates, South Indian, Weekend Special, Dessert, Drinks)
- **Total Items Extracted**: 46

## Uncertainties and Missing Information
- **Prices**: Prices are marked as `needs-confirmation` and `needsReview: true` because the Wix audit reveals severe pricing conflicts with the live Clover catalog (e.g. Wix prices are significantly cheaper than Clover). These are imported as integer cents (e.g. `225` for `$2.25`) but must not be treated as confirmed.
- **Descriptions**: Almost all descriptions are missing from the Wix source. Dietary, allergen, and detailed description information must not be inferred or hallucinated.
- **Dietary & Allergen Information**: No explicit dietary labeling is provided systematically. 
- **Dessert Items**: "See Refrigerator" labels for desserts require client review and replacement.

## Archival Data
The prior 47-item catering menu (extracted from `menu.pdf` with absent prices) has been archived to `server/data/archive/catering-menu-draft.json` for preservation.

## Confirmation
The current dataset is provisional and requires client review. The dataset metadata identifies itself as `publicationStatus: "draft"` and `isProvisional: true`.
