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
