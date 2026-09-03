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

## Mobile Browser Lifecycle & Back-Forward Cache (BFCache)
Mobile browsers routinely preserve tab states in memory (BFCache) when backgrounded. This means closing and reopening the browser may revive the exact DOM and sessionStorage variables without executing a full page reload.

To prevent the video from freezing or failing to restart, LogoIntro hooks into pageshow and isibilitychange window events. Upon restoration:
- If the session flag (samosa-house-intro-seen-v2) is active, the overlay is dismissed instantly without animation.
- If the video was halted mid-playback, it safely attempts to resume.

## Playback Startup Watchdog
A short 1200ms watchdog timer begins the moment ideo.play() is invoked. This timer requires the video element to physically emit a playing event before it expires. If the browser blocks playback silently (e.g., due to backgrounding, battery-saver constraints, or stalled rendering), the watchdog immediately assumes completion and dismisses the intro. This prevents the user from staring at a frozen/blank background for the full 3.5s emergency fallback.

To avoid duplicating the intro (where a static logo flashes before the MP4 logo begins), the overlay remains fully transparent (opacity-0 pointer-events-none) and leaves the main menu visible and interactive underneath until the exact moment the video emits the playing event. If playback fails or is rejected, the intro silently cancels and leaves the menu visible. A static logo fallback is only rendered when prefers-reduced-motion is active.
