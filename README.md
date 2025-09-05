# Novelty Cams — Live Now UI
This is a static, GitHub Pages–ready UI that mimics the dark card layout you shared.

## Files
- `index.html` — Live grid + four corner controls (Profile, Menu, Chat, Mini-Slots)
- `css/styles.css` — Dark, modern look
- `js/app.js` — Renders cards from `data/rooms.json`, simple interactions
- `data/rooms.json` — Sample 21 rooms

## Deploy (GitHub Pages)
1. Create a repo and upload these files (keep the folders).
2. In **Settings → Pages**, set Source to your default branch and the root folder.
3. Open the Pages URL.

> If you open `index.html` via `file://`, the browser will block `fetch('data/rooms.json')` with CORS. Host it (Pages) and it will work.
