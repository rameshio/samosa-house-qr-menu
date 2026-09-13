# Design System

This design system uses provisional design tokens pending final branding approval.
Styling is powered by Tailwind CSS v4 using CSS-first configuration.

## Provisional Brand Colors
- **Saffron**: `#F29F05` (`bg-brand-saffron`, `text-brand-saffron`)
- **Dark Red**: `#8C1C13` (`bg-brand-dark-red`, `text-brand-dark-red`)
- **Heritage Green**: `#2E472D` (`bg-brand-heritage-green`, `text-brand-heritage-green`)
- **Neutral Background**: `#F5F5DC` (`bg-brand-neutral-bg`)
- **Primary Text**: `#1A1A1A` (`text-brand-primary-text`)

These colors are mapped as CSS variables in `client/src/styles/global.css` under the `@theme` directive.

## Brand Assets
- **Logo**: The active logo is stored at `client/public/images/brand/samosa-house-logo.png`.
- **Transparency Handling**: The current logo is a transparent PNG. It correctly overlays natively onto brand backgrounds (e.g., Saffron) without clipping rectangles.

### Menu Item Images
- **Universal Layout**: Uses `aspect-[4/3]` and `object-contain` over a subtle `bg-gray-100` to guarantee the entire dish is visible without cropping across all device sizes.

### Menu Item Cards
- **Grid Layout**: Responsive grid utilizing `grid-cols-2` on mobile devices up to `grid-cols-4` on large desktop environments, using gaps between `gap-3` and `gap-6`.
- **Card Structure**: Vertical stack (image top, text bottom) using `flex-col h-full` for consistent row heights.
- **Card Styling**: `bg-white/95`, `border border-gray-200`, `shadow-sm`, `rounded-xl`.
- **Typography Layout**: Titles map to `line-clamp-2` to prevent vertical blowout, and prices are wrapped efficiently using a flexible grid.

### Menu Card Hover Effect
Desktop interactive elements use a subtle pointer-tracking mesh gradient border on hover/focus. It utilizes Saffron, Gold, and Ivory to match the brand. It falls back to a static border on touch devices or when reduced motion is preferred.

### Menu Cards
- **Style**: Premium borderless cards with large rounded food images (aspect 4:3). Content flows cleanly directly beneath the image.
- **Hover Effect**: The animated mesh gradient glow is restricted to the rounded image frame rather than the entire card.
