# Logo Animation

## Overview
Phase 5 introduced a Samosa House logo treatment that functions as a 2-second intro overlay.
This intro runs strictly once per browser session.

## Asset Implementation
The intro uses the official 3-second animated welcome video (`samosa-house-welcome-unique-3s-v2.mp4`).
The video runs in full-screen over the saffron background, utilizing `object-contain` to preserve aspect ratio. 
To ensure reliable autoplay inside React, the component utilizes a `useRef` hook and strictly modifies DOM properties directly (e.g. `video.muted`, `video.defaultMuted`, `video.playsInline`) because relying exclusively on React JSX attributes fails intermittently on mount.
Additionally, the component handles the `video.play()` promise. If the promise is rejected with an `AbortError` (frequently triggered by React Strict Mode development re-mounts), the component ignores it to prevent prematurely displaying a fallback. Any genuine media rejection gracefully degrades to the static transparent logo (`samosa-house-logo.png`).

To ensure returning users view the new updated animation, the component relies on the versioned session key `samosa-house-intro-seen-v2`. Previous keys like `samosa-house-intro-seen` will safely ignore the updated intro status. The `sessionStorage` flag is written exclusively *after* the intro successfully completes or triggers the emergency fallback, ensuring the overlay won't prematurely disappear due to cache reloads.

## Duration and Timing
The core logic for duration now relies primarily on the video's `ended` event to dismiss the intro naturally. 
As a safeguard, a fallback timer (`INTRO_FALLBACK_DURATION`) of 3500ms ensures the UI cannot get permanently trapped if video events fail to fire. 
The fade-out animation takes `INTRO_FADE_DURATION` (300ms).

## Accessibility Details
- Supports `prefers-reduced-motion` through Tailwind's `motion-reduce:` overrides.
- The component uses `role="dialog"` and `aria-modal="true"`.
- Preserves the DOM context (application is not hidden visually from screen readers, just overlaid) so parsing is continuous.

## Storage
Session state is tracked via `sessionStorage.getItem('samosa-house-intro-seen-v2')`.
To manually re-trigger the animation during testing, run this in the browser console:
```javascript
sessionStorage.removeItem('samosa-house-intro-seen-v2')
```
