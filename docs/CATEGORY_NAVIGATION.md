# Category Navigation

## Overview
Phase 8 implements a mobile-first, horizontally scrollable sticky navigation bar for menu categories. The categories are populated dynamically from the backend menu response.

## Component Architecture
- **\CategoryNavigation.jsx\**: The presentation component rendering the semantic \<nav>\ with horizontally scrollable \<a>\ elements for each category. It receives \ctiveCategoryId\ as a prop to manage active tab styling, applying \ria-current\ when active.
- **\useCategoryScroll.js\**: A custom React hook managing scroll tracking, URL hash updates, and \IntersectionObserver\ logic. It isolates complex scroll calculations and event timing from the view layers.
- **\MenuPage.jsx\**: Container logic orchestrating the menu fetch, rendering \CategoryNavigation\, and injecting stable IDs (e.g., \id=\"category-appetizers\"\) into the respective \MenuSection\ instances.

## Sticky Positioning
The navigation maintains a fixed vertical position relative to the main viewport. It rests precisely below the sticky \Header\.
- Top offsets are explicitly mapped: \	op-[64px]\ (mobile) and \	op-[80px]\ (desktop).
- To prevent content from vanishing beneath the sticky areas, all target \<section>\ blocks employ \scroll-margin-top\ equivalent to the combined header and navigation heights (~135px mobile / 150px desktop).

## Active-Category Detection
When native \IntersectionObserver\ is available, \useCategoryScroll\ assigns an observer to all \<section>\ elements. 
- It uses a custom \ootMargin\ of \-150px 0px -60% 0px\ to correctly detect elements intersecting the visible viewport below the sticky bars.
- Clicking a category triggers an immediate smooth-scroll. To prevent rapid flickering of the active state as intermediate sections glide past the viewport, observer events are ignored for \1000ms\ post-click using an \isClickScrolling\ ref.

## Initial URL Hash Behavior
Upon mounting, if the user navigated to the page via a direct category hash (e.g. \#category-chaat\), the system natively verifies the category exists in the API response.
If verified, the active state updates immediately and the browser scrolls cleanly to the anchor coordinates after a short \setTimeout\ to permit DOM settling.
Invalid hashes fall back gracefully to the first available category.

## Mobile Horizontal Scrolling
On narrow displays, the navigation row stretches horizontally without wrapping:
- Applies \overflow-x-auto whitespace-nowrap scrollbar-hide\.
- Whenever a category becomes active (via scroll or initial hash), the \CategoryNavigation\ component calls \scrollIntoView({ inline: 'center' })\ on the respective anchor tag, ensuring the active category remains visible horizontally without requiring manual swiping.

## Accessibility Behavior
- Nav acts as a semantic \<nav aria-label=\"Menu categories\">\.
- Active item uses \ria-current=\"location\"\.
- All controls are focusable and keyboard-navigable via the native \<a>\ element properties.
- **Reduced Motion**: Respects the user's OS-level accessibility preference. If \(prefers-reduced-motion: reduce)\ is active, \ehavior: 'smooth'\ is disabled, instantly snapping to the section anchor natively.

## Testing & Fallbacks
Mocks for \IntersectionObserver\ and \matchMedia\ were explicitly designed for the Vitest test suite.
A \	ry/catch\ block protects the horizontal \scrollIntoView({ inline: 'center' })\ logic, as certain older mobile WebKit implementations reject inline behavior properties, defaulting to a standard \scrollIntoView()\ gracefully.
