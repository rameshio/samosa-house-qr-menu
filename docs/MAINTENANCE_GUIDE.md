# Samosa House QR Menu Maintenance Guide

## 1. Project Overview
The Samosa House QR Menu is a full-stack web application designed for mobile and desktop restaurant viewing.
- **Frontend**: Built with **React** and **Vite** for fast rendering, styled exclusively with **Tailwind CSS**.
- **Backend**: Powered by **Node.js** and **Express** to provide a secure API layer.
- **Data Source**: The menu is driven entirely by a static **JSON** file, avoiding the complexity of a database.
- **Development Mode**: Uses Vite's hot-reloading server alongside the Express server, allowing instant feedback as you code.
- **Production Docker Mode**: Packages the pre-built React frontend and the Node.js backend into a single container serving everything on port 8080.

## 2. How the Application Works
The application fetches menu data from the server and paints it onto the screen. Here is the exact data flow:

server/data/menu.json
→ Express controller
→ GET /api/menu
→ frontend API client
→ menu service
→ MenuPage
→ MenuSection
→ MenuItemCard

**Step-by-step**:
1. The Express server reads the raw data from `server/data/menu.json`.
2. The server exposes this data at the `/api/menu` web address.
3. The frontend's `apiClient` requests this address.
4. The `menuService` cleans up the response so the UI can easily read it.
5. `MenuPage` receives the list of categories and loops through them.
6. `MenuSection` creates a heading for each category and loops through its items.
7. `MenuItemCard` draws the final photo, price, and description for a single food item.

## 3. Important File Map
- `server/data/menu.json`: The absolute source of truth for all menu text, prices, and images.
- `server/src/routes/menuRoutes.js`: Defines the `/api/menu` URL path.
- `server/src/controllers/menuController.js`: Reads the JSON file and handles sending it to the frontend.
- `server/src/app.js`: The main Express server configuration, handles routing and production static serving.
- `client/src/services/apiClient.js`: The fetch wrapper that makes HTTP requests to the backend.
- `client/src/services/menuService.js`: Calls the apiClient specifically for menu data.
- `client/src/pages/MenuPage.jsx`: The main layout combining the header, hero, navigation, and menu list.
- `client/src/components/Header.jsx`: The top sticky bar containing the logo.
- `client/src/components/HeroSection.jsx`: The introductory banner with the large image and welcome text.
- `client/src/components/LocationDisplay.jsx`: The green banner showing the current restaurant location.
- `client/src/components/CategoryNavigation.jsx`: The horizontal scrolling bar containing category links.
- `client/src/components/MenuSection.jsx`: Groups items under a category heading (e.g., "Appetizers").
- `client/src/components/MenuItemCard.jsx`: The visual card displaying an individual food item.
- `client/src/components/DietaryBadge.jsx`: The small colored pills showing "Vegan", "Spicy", etc.
- `client/src/components/Footer.jsx`: The bottom section containing copyright and contact information.
- `client/src/components/LogoIntro.jsx`: The full-screen video that plays once per session.
- `client/src/styles/global.css`: Contains global Tailwind configuration, custom fonts, and brand colors.
- `client/public/favicon.svg`: The vector "s" icon displayed in the browser tab.
- `client/public/images/menu-west-v2/`: The folder containing all optimized `.webp` food photography.
- `Dockerfile`: The instructions for packaging the app into a production container.
- `.dockerignore`: Prevents local development files from bloating the Docker container.

## 4. Menu Data Structure
Here is a real item from `server/data/menu.json`:
```json
{
  "id": "samosa",
  "name": "Samosa",
  "description": "",
  "basePriceCents": 225,
  "priceStatus": "needs-confirmation",
  "needsReview": true,
  "image": "/images/menu-west-v2/samosa.webp",
  "dietary": [],
  "spicy": false,
  "allergens": [],
  "available": true,
  "sortOrder": 1
}
```
- **`id`**: A unique text string identifying the item. Must not contain spaces.
- **`name`**: The public-facing name of the dish.
- **`description`**: Details about the dish. Leave as an empty string `""` if none.
- **`basePriceCents`**: The price in pennies (e.g., 225 = $2.25).
- **`priceStatus`** & **`needsReview`**: Internal flags used for auditing menu accuracy.
- **`image`**: The exact URL path to the `.webp` photo.
- **`dietary`**: An array of strings like `["vegan", "glutenFree"]` that generate badges.
- **`spicy`**: A true/false boolean. If true, a red "Spicy" badge is displayed.
- **`allergens`**: An array for internal allergen tracking.
- **`available`**: A true/false boolean. If false, the item is grayed out and marked "Unavailable".
- **`sortOrder`**: Determines the order items appear within their category.

## 5. How to Change a Menu Price
Prices are stored as integers representing cents (`basePriceCents`). This prevents floating-point math errors.

Examples:
- $2.25 = `225`
- $3.00 = `300`
- $10.50 = `1050`
- $12.99 = `1299`

Open `server/data/menu.json`, find the item, and change the number.
**Tests to run**: `npm run test` (in both `client` and `server`).
**Manual checks**: View the application to confirm the price renders correctly formatted with a dollar sign.

## 6. How to Change an Item Name or Description
Locate the item in `server/data/menu.json` and edit the string.

*Before:*
```json
{
  "id": "samosa",
  "name": "Samosa",
  "description": ""
}
```
*After:*
```json
{
  "id": "samosa",
  "name": "Punjabi Samosa",
  "description": "Crispy pastry filled with spiced potatoes and peas."
}
```

## 7. How to Add a New Menu Item
1. Open `server/data/menu.json`.
2. Locate the correct category (e.g., inside the `items` array of "Appetizers").
3. Create a new object enclosed in curly braces `{}`.
4. Ensure standard JSON rules: wrap keys and string values in double quotes, and separate items with commas (but no comma after the last item in a list).
5. Provide a unique `id`, `name`, `description`, `basePriceCents`, `image` path, `available` status, and dietary fields.
6. Run server and client tests to ensure the JSON is valid and breaks no constraints.

## 8. How to Remove an Item Safely
- **Setting `"available": false`**: The safest method. The item remains in the database and renders in the UI, but gets grayed out and labeled "Unavailable". It preserves historical data.
- **Permanently deleting**: Erasing the entire `{ ... }` block from `menu.json`. Use this only if an item is permanently discontinued. 
**Recommendation**: Mark items unavailable first.

## 9. How to Replace a Menu Image
1. Export a compressed, web-optimized `.webp` image.
2. Name it with a simple lowercase filename (e.g., `samosa-new.webp`).
3. Place it in `client/public/images/menu-west-v2/`.
4. Update `server/data/menu.json` to point to the new path: `"/images/menu-west-v2/samosa-new.webp"`.
5. **Never** include a backslash (\`) or dot (`.`) before the first forward slash in the JSON path.
6. Check the UI to confirm sharpness, aspect ratio (ensure it isn't awkwardly cropped on mobile), and verify there are no 404 console errors. Preserve the old image in the folder until the change is fully approved.

## 10. How to Add or Rename a Category
- Modify the `categories` array in `server/data/menu.json`.
- Each category needs an `id`, `name`, `description`, `sortOrder`, and an `items` array.
- **Considerations**: The category `id` is used in the URL hash (e.g., `#category-appetizers`). If you change an ID, incoming bookmarks to that category will break. Changing category names does not break links, only changing the `id` does.

## 11. How to Change Restaurant Information
Some restaurant information is coded directly into the frontend:
- **Location**: Found in `client/src/pages/MenuPage.jsx` (`<LocationDisplay location="Culver City" />`) and defaults in `client/src/components/LocationDisplay.jsx`.
- **Hero text**: Found in `client/src/components/HeroSection.jsx`.
- **Footer text**: Found in `client/src/components/Footer.jsx`.
- **Restaurant name & Browser title**: Found in `client/index.html` (`<title>`) and as textual branding in `Footer.jsx` and `HeroSection.jsx`.
- **Favicon**: Replace `client/public/favicon.svg`.

**Duplication Warning**: The brand name "Samosa House" exists in multiple places (`index.html`, `Footer.jsx`, `HeroSection.jsx`, and various automated tests). You must update them all simultaneously to avoid breaking tests.

## 12. How to Change the Design
Tailwind CSS controls the design directly inside component files:
- **Header**: `client/src/components/Header.jsx`
- **Hero**: `client/src/components/HeroSection.jsx`
- **Sticky category bar**: `client/src/components/CategoryNavigation.jsx`
- **Menu cards**: `client/src/components/MenuItemCard.jsx`
- **Dietary badges**: `client/src/components/DietaryBadge.jsx`
- **Footer**: `client/src/components/Footer.jsx`
- **Colors & Typography**: `client/src/styles/global.css`
- **Liquid-glass styling**: Managed via `bg-white/85 backdrop-blur-md` utility classes on the Header and Category Navigation.

**Warning**: Design changes should only alter classes (`className="..."`), never the data props or API fetching logic.

## 13. Welcome Video
- **Video component**: `client/src/components/LogoIntro.jsx`
- **Video asset path**: `/videos/samosa-house-welcome-unique-3s-v2.mp4`
- **Session behavior**: The video plays once per user session. This is tracked in the browser using `sessionStorage` with the key `samosa-house-intro-seen-v2`. 
- **Reduced-motion**: The component respects operating system accessibility preferences. If a user prefers reduced motion, the video is skipped entirely.
- **Warning**: Do not remove this logic casually, as auto-playing videos on every page load severely impacts user experience and bandwidth.

## 14. URL Categories and Scrolling
- **Category hashes**: Clicking a category updates the URL to `#category-id` so users can share links to specific sections.
- **IntersectionObserver**: A background watcher in `useCategoryScroll.js` that detects which section you are currently reading.
- **Sticky category navigation**: The horizontal bar stays at the top of the screen (`CategoryNavigation.jsx`).
- **Active category tracking & Refresh restoration**: The observer highlights the correct button in the bar. If you refresh, the app scrolls you back to your previous category.
- **No vertical jumping**: When the observer updates the URL, it strictly uses `history.replaceState` instead of assigning to `window.location.hash`. This ensures the page doesn't forcefully snap vertically and interrupt manual scrolling.

## 15. Development Commands
Navigate to the `client/` or `server/` directories to run these:
- **Installing dependencies**: `npm install`
- **Starting client**: `npm run dev`
- **Starting server**: `npm run dev` (or `npm start`)
- **Running client tests**: `npm run test`
- **Running server tests**: `npm run test`
- **Running lint**: `npm run lint`
- **Creating a production build**: `npm run build`

## 16. Docker Workflow
- **Why Docker must be rebuilt**: Docker images are sealed snapshots. Editing a local file does not affect an already-built image. You must rebuild the image to package your new code and JSON data.
- **Exact build command**: `docker build -t samosa-house-preview:west-v2 .`
- **Exact temporary container command**: `docker run -d --name samosa-preview -p 8080:8080 samosa-house-preview:west-v2`
- **How to view logs**: `docker logs samosa-preview`
- **How to stop the exact preview container**: `docker rm -f samosa-preview`
- **Localhost URL**: Available on your own machine at `http://localhost:8080`.
- **Local Wi-Fi URL concept**: Available to devices on your exact same Wi-Fi network (e.g., `http://10.0.0.X:8080`).
- **Why a private IP does not work externally**: Private IPs are confined to your home router. A friend in another location cannot access it.
- **Temporary Cloudflare tunnel**: We use cloudflared to expose localhost:8080 securely to the public internet via a `.trycloudflare.com` link.
- **Security warning**: Anyone who guesses or receives your temporary Cloudflare link can access your local application while the tunnel is running.

## 17. Safe Git Workflow
1. **Inspect status**: `git status --short` to ensure your working tree is clean.
2. **Create a dedicated branch**: `git checkout -b feature-name`
3. **Make one focused change**: Edit your files.
4. **Test**: Run client and server tests.
5. **Manually verify**: Check the UI in a browser.
6. **Update documentation**: Record changes in `docs/CHANGELOG.md`.
7. **Commit**: `git commit -m "feat: description of change"`
8. **Push**: `git push -u origin feature-name`
9. **Obtain approval & Merge**: Use GitHub Pull Requests to merge only after approval.

**Warnings**:
- Never force push (`git push -f`).
- Do not reset a dirty working tree unless you are absolutely sure you want to permanently delete uncommitted work.
- Never commit `.env` secrets or passwords.
- Never edit files directly on the main branch.

## 18. Files and Folders Never to Edit Manually
- `node_modules/`: Generated by `npm install`. Edits here are deleted automatically.
- `client/dist/`: Generated by `npm run build`. Contains the compiled application.
- `.git/`: Internal Git tracking folder. Modifying it corrupts version history.
- **Environment files** (e.g., `.env`): Never commit these to Git if they contain API keys or secrets.
- **Docker image archives**: `.tar` files generated by `docker save` should not be committed to Git due to enormous file sizes.

## 19. Testing Checklist
- **Menu-data updates**: Run `npm run test` in the server directory to ensure JSON validity. Check the UI to ensure new text doesn't break layout.
- **Image updates**: Ensure file exists, check browser console for 404s, simulate slow 3G networks to test loading performance.
- **UI changes**: Run `npm run test` in the client directory. 
- **Mobile testing**: Resize browser to 320px, 375px, 390px. Verify no horizontal scrolling overflow and that tap targets are large enough.
- **Docker testing**: Rebuild container, check docker logs, and ensure `http://localhost:8080` loads the latest code.
- **Before committing**: `git diff --check` to catch trailing whitespace, ensure no `.env` files are staged, and confirm all automated tests pass.

## 20. Common Problems
- **Menu change not appearing**: If in Docker, you forgot to run `docker build`. If in development, check if you saved the `menu.json` file.
- **Docker still showing an old version**: You likely ran `docker run` without stopping the old container, or you skipped the `docker build` step entirely.
- **Broken image**: The file name is spelled wrong, you used an uppercase letter, or you forgot the leading slash (e.g., `images/` instead of `/images/`).
- **JSON syntax error**: You likely missed a comma `,` between items, or left a trailing comma after the last item in a list. Run `npm run lint`.
- **Test failing after text changes**: You changed a public brand name (like "Samosa House") and the test in `MenuPage.test.jsx` is still expecting the old name. Update the test.
- **Browser showing an old favicon**: Browsers aggressively cache favicons. Do a hard refresh (Ctrl+F5) or clear your browser cache.
- **Phone cannot access local URL**: Ensure your phone is connected to the exact same Wi-Fi network as your computer, and verify your firewall allows port 8080 traffic.
- **Remote friend cannot access private Wi-Fi URL**: They need the public Cloudflare tunnel URL, not your `10.x.x.x` IP address.
- **Sticky category bar not working**: Someone accidentally added `overflow: hidden` to a parent container (like `MenuPage.jsx`), breaking the CSS sticky context.
- **Page jumping while scrolling**: Avoid using `element.scrollIntoView()` on elements inside sticky headers; it natively forces the entire page to snap.

## 21. Quick Reference Table

| What I want to change | File to edit | Tests to run | Docker rebuild required? |
| :--- | :--- | :--- | :--- |
| Food price or description | `server/data/menu.json` | Server & Client tests | Yes |
| Food photography | Upload to `client/public/images/` & edit `menu.json` | None (manual check) | Yes |
| Restaurant location text | `client/src/pages/MenuPage.jsx` | Client tests | Yes |
| Hero welcome text | `client/src/components/HeroSection.jsx` | Client tests | Yes |
| App colors or fonts | `client/src/styles/global.css` | Client lint | Yes |
| Favicon icon | `client/public/favicon.svg` | None (manual check) | Yes |
| Add new dietary badge | `client/src/components/DietaryBadge.jsx` | Client tests | Yes |

*Note: This maintenance guide reflects the system architecture as of September 2026. Always update this guide when structural application changes are made.*
