# FSD-2 Quiz / Interview System

A responsive quiz and interview preparation portal for Semester 4 FSD-2 revision. The app includes unit-wise navigation, MCQ practice, answer reveal panels, search, filters, question jump, PYQ tagging, and a lightweight Node server for local hosting.

> Note: this workspace contains a static HTML/CSS/JS frontend, not an extracted React source tree. The current upgrade keeps the existing design and adds a dependency-free Node backend/server so the project runs cleanly over HTTP.

## Tech Stack

- Frontend: HTML5, CSS3, vanilla JavaScript
- Backend/local server: Node.js built-in `http` module
- Data: `data.json`
- UI assets: Google Fonts and Font Awesome CDN

## Folder Structure

```text
.
├── index.html       # Home page
├── unit.html        # Quiz/question viewer page
├── style.css        # Full responsive UI styling
├── script.js        # Question rendering, filters, MCQ behavior
├── data.json        # Question bank
├── server.js        # Node local server and questions API
├── package.json     # Run scripts
└── README.md        # Project documentation
```

## Setup

1. Install Node.js 18 or newer.
2. Open the project folder in a terminal.
3. Run:

```bash
npm start
```

4. Open:

```text
http://localhost:3000
```

Useful API endpoint:

```text
http://localhost:3000/api/questions?unit=all&type=mcq
```

## Bugs Found

- MCQ question text and long code-like options could overflow outside the card.
- Options were rendered as generic divs, which made click behavior and keyboard accessibility weaker.
- Option cards could become cramped in two-column layouts on small tablets.
- Toolbar, filters, buttons, and footer could force horizontal overflow on mobile.
- Home page had a broken closing `</nav>` tag without an opening nav.
- Marks filter was visible but not actually functional in JavaScript.
- Some controls were missing button types or accessible labels.

## What Was Fixed

- Added robust wrapping with `overflow-wrap`, `word-break`, and responsive grid constraints.
- Converted MCQ options into full-width button controls with consistent padding and hit area.
- Added answered/selected state handling for MCQs and disabled options after selection.
- Improved mobile, tablet, and desktop breakpoints for the toolbar, filters, cards, options, and footer.
- Fixed the home topbar HTML structure.
- Populated the marks dropdown dynamically from `data.json` and enabled mark filtering.
- Added safer JS guards for missing data fields and reused controls.
- Added a local Node server with static hosting and a `/api/questions` endpoint.

## UI/UX Improvements

- Cleaner question cards with consistent spacing and subtle depth.
- Better hover and focus states for options and controls.
- More stable responsive layouts using flexible grids and rem-based spacing.
- Full-width mobile-friendly buttons where needed.
- Answer/code panels now wrap or scroll safely without breaking the page.
