# BazaarBolo — Voice-Ready Item Cards

A small browser experience that lets you browse a list of items, edit their English/Hindi labels, and trigger text-to-speech (TTS) in each language. A glowing, card-based UI showcases the items; you can also add new items via the top-left “+” control using simple prompts.

This README is intentionally long and detailed. It explains what the app does, how to run and build it, where things live, how the TTS wiring works, and how to extend or debug it.

---

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the dev server**
   ```bash
   npm start
   ```
   By default this serves `index.html` from the project root (often on `http://localhost:15500` or similar if using the provided static server).

3. **Open the app**
   Visit the served URL in a modern browser (Chrome recommended for Web Speech API support).

You should see a glowing purple background with a grid of item cards, each showing a placeholder image, two text inputs (English/Hindi), and ENG/HIN buttons that speak the current label.

---

## What You Get Out of the Box

- **Interactive cards**: Each item shows an image, two editable text inputs, and language-specific TTS buttons.
- **Speech synthesis**: The browser’s Web Speech API speaks English or Hindi phrases.
- **Dynamic item creation**: Click the top-left “+” to add a new item via prompts (English text, Hindi text, and an optional image URL; defaults to `/img/placeholder.png`).
- **Glowing UI**: Inspired by neon gradients; cards have soft glows, buttons shimmer on hover, and the layout remains unchanged while the styling is upgraded.
- **Keyboard-friendly inputs**: Edit text directly; buttons stay wired via event delegation so new cards work without extra code.

---

## Project Structure

- `index.html` — Entry point, markup for header and the item grid. Links the stylesheet and the module script.
- `dist/project-template.css` — Main styles: gradients, glowing cards, button states, responsive rules.
- `src/index.js` — All runtime logic: TTS helper, event delegation for buttons, “+” prompt flow, dynamic item creation. Also exports `LatLon`/`LatLonBounds` from the legacy geo utilities.
- `src/geo/latlon.js` / `src/geo/latlonBounds.js` — Simple Lat/Lon helpers kept for compatibility; not used by the UI but still exported.
- `img/placeholder.png` — Default image used when none is provided.
- `package.json` — Scripts and dependency manifest.

---

## How the UI Is Laid Out

- **Header**: Fixed near the top with a “+” button on the left. The header remains in place; only visuals were enhanced (glow, gradient).
- **Items grid**: A flex-wrapped layout (`.items-list`) where each `.item` keeps its position; styling adds glassy panels and glow but no structural changes.
- **Card contents**:
  - Image on the left (defaults to `/img/placeholder.png`).
  - Two stacked text inputs: English (top) and Hindi (bottom).
  - Vertical action buttons on the right: ENG and HIN.

---

## Text-to-Speech (TTS) Details

Location: `src/index.js`

- `speak(text, { lang, rate, pitch, volume })`
  - Uses `window.speechSynthesis` and `SpeechSynthesisUtterance`.
  - Chooses a voice that matches `lang` prefix (e.g., `"en"` or `"hi"`), falling back to the first available voice.
  - Cancels any ongoing speech before speaking the new utterance.

- **Button wiring**
  - Event delegation on `.items-list`: `handleItemButtonClick` catches clicks on `.item-actions button`.
  - Spoken text comes from `data-speak` (or `data-phrase`/button text as fallback).
  - Language is determined by `data-lang` (e.g., `"en"` or `"hi"`).

- **Dynamic items**
  - When you create a new item, ENG/HIN buttons are created with `data-lang` and `data-speak` set to the provided inputs, so TTS works immediately.

Browser support caveat: The Web Speech API is best supported in Chromium-based browsers. If voices are unavailable, the code logs to console instead.

---

## Adding a New Item (UI Flow)

1. Click the **“+”** button in the top-left header.
2. You’ll be prompted for:
   - **English text** (default: “New item”)
   - **Hindi text** (default: “नया आइटम”)
   - **Image URL** (default: `/img/placeholder.png`)
3. On completion, a new card is appended to `.items-list` with:
   - The provided image URL (or placeholder).
   - Two inputs prefilled with your English/Hindi text.
   - ENG/HIN buttons wired for TTS with those phrases.

---

## Customizing Content

- **Change spoken phrases**: Edit `data-speak` on each ENG/HIN button in `index.html`. Dynamic items take their `data-speak` from the prompt values.
- **Change default image**: Update the fallback in `src/index.js` (`createItem`) and/or the hardcoded `src` values in `index.html`.
- **Edit displayed labels**: The inputs are live in the DOM; you can type directly. (By default, `data-speak` is set at creation; we can extend to sync on blur if desired.)

---

## Styling Notes

- Gradients and glows are defined in `dist/project-template.css`.
- Cards: rounded corners, subtle borders, inset highlights, hover glow.
- Buttons: linear gradient fill with a luminous hover shadow.
- Responsive behavior:
  - Desktop: 3 cards per row (flex wrap).
  - Medium screens: 2 per row.
  - Small screens: single column, smaller images, horizontal button grouping.

If you want to tweak the theme, adjust the CSS variables at the top of `dist/project-template.css` (colors, shadows, radii).

---

## Scripts (package.json)

Typical scripts from the starter template (may vary slightly):

- `npm start` — Starts the static server and watches sources.
- `npm run build-dev` — Browserify bundle with assertions intact.
- `npm run watch-dev` — Watch-and-build.
- `npm run build-min` — Minified bundle and sourcemap.
- `npm run build-docs` — Generates documentation JSON (documentation.js).
- `npm run lint` / `npm run lint-docs` — Lint code and docs.
- `npm test` / `npm run test-unit` / `npm run test-flow` / `npm run test-cov` — Tests and coverage.
- `npm run pre-production` — Aggregate checks before release.

Check `package.json` to confirm exact script names in your clone.

---

## Development Workflow

1. **Run the dev server** (`npm start`) and open the app.
2. **Edit HTML/CSS** for layout or theming.
3. **Edit `src/index.js`** for behavior (prompts, TTS logic, event wiring).
4. **Add assets** under `img/` (e.g., replace `placeholder.png`).
5. **Test TTS** in Chrome; check console if speech fails (voice availability varies).

---

## Extending the App

- **Sync inputs to TTS on change**: Add `input`/`blur` listeners to update `data-speak` so the latest typed text is spoken.
- **Support more languages**: Add more buttons per card with appropriate `data-lang` codes and `data-speak` phrases.
- **Persist items**: Save items to `localStorage` or a backend and hydrate on load.
- **Image upload**: Replace the URL prompt with a file selector and object URLs.

---

## Troubleshooting

- **TTS not speaking**: Ensure the browser supports Web Speech API; try Chrome. Wait for voices to load (handled via `onvoiceschanged`).
- **Broken images**: Check the image URL or replace `placeholder.png` with a valid asset.
- **Buttons not working on new items**: Event delegation on `.items-list` should cover new items; confirm the container has the correct class.
- **Imports failing**: Module imports use explicit `.js` extensions (e.g., `./geo/latlon.js`). Ensure you serve via a local server, not `file://`.

---

## Folder Structure (Current)

- `index.html` — UI markup, header, items grid.
- `dist/project-template.css` — All styling for layout, glow, responsiveness.
- `src/index.js` — Runtime logic (TTS, prompts, dynamic items), plus exports of geo utilities.
- `src/geo/latlon.js`, `src/geo/latlonBounds.js` — Legacy geo helpers.
- `img/placeholder.png` — Default image for items.
- `package.json` / `package-lock.json` — Dependencies and scripts.
- `build/`, `debug/`, `dist/` — Output and debug assets (depending on scripts run).

---

## License

See `LICENSE` for details. This project started from a JavaScript template and has been customized with a glowing UI and TTS interaction layer.

