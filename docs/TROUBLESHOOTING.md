# Troubleshooting

## API & Data Issues

### The menu endpoint returns 500
If `GET /api/menu` returns an HTTP 500 status:
- Ensure the JSON file is physically present at `server/data/menu.json`.
- Check if the JSON is malformed (e.g. missing commas or brackets).
- Review the Node.js terminal logs for specific runtime errors. The server intentionally intercepts validation or parsing errors and responds with a safe generic 500 to the client, logging the stack trace only in the terminal.

### The JSON file fails validation
If the backend throws a validation error upon loading the JSON:
- Check that all prices (`basePriceCents`) are strictly non-negative integers or exactly `null`.
- Verify `priceStatus` is exactly one of `"confirmed"`, `"needs-confirmation"`, or `"not-provided"`.
- Ensure all category IDs and item IDs are unique.
- Confirm metadata strings like `menuType` and `publicationStatus` are properly set.

## Frontend Issues

### The frontend cannot load the menu
If the frontend displays a red "Unable to load menu" fallback screen:
- Confirm the Express backend is running in a separate terminal (`npm run dev` in `server/`).
- Verify the Vite dev server proxy is correctly routing `/api` traffic to `http://localhost:3000`.
- Check the Browser Console for CORS errors.
- Click "Retry" in the UI after starting the backend.

### Prices display incorrectly
If a price displays weirdly (e.g., "$0.00" when it should be unknown, or "Price unavailable" when it shouldn't be):
- Check `server/data/menu.json` to ensure the item does not have `basePriceCents: 0`. It should be `null` with `priceStatus: "not-provided"` if unknown.
- If it is a confirmed price, ensure `basePriceCents` is correctly factored in integer cents (e.g., `499` for `$4.99`, not `4.99`).
