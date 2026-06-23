# FSD-2 Purple Portal — LJU Exam Prep

A modern, responsive exam preparation portal for LJ University Full Stack Development 2 (FSD-2) course. Practice **484 questions** across **10 units** with MCQ, theory, descriptive, and programming question types.

## Features

- **Multi-Page Architecture**: Split data into per-unit JSON files for faster loading
- **Mobile & Desktop Responsive**: Works perfectly on phones and PCs
- **MCQ Interactive Mode**: Click options to check answers with visual feedback
- **Jump to Question**: Navigate directly to any question by number
- **Advanced Filtering**: Search by keyword, marks, PYQ status, and question type
- **Code Syntax Highlighting**: VSCode-style highlighting for code answers
- **Smooth Animations**: Modern UI with glassmorphism and ambient effects
- **Accessibility**: Keyboard navigation, ARIA labels, screen reader support

## Project Structure

```
fsd2-portal/
├── index.html          # Home page
├── unit.html           # Unit viewer page (all questions)
├── style.css           # Styles (mobile + desktop responsive)
├── script.js           # Application logic
├── README.md           # This file
├── BUGS_FIXED.md       # Detailed list of bugs found and fixed
└── data/               # Split JSON data for faster loading
    ├── data_u1.json    # Unit 1: JSON (36 questions)
    ├── data_u2.json    # Unit 2: Node.js Core (52 questions)
    ├── data_u3.json    # Unit 3: Server Creation (30 questions)
    ├── data_u4.json    # Unit 4: Express.js (46 questions)
    ├── data_u5.json    # Unit 5: State & API (44 questions)
    ├── data_u6.json    # Unit 6: Advanced Express (34 questions)
    ├── data_u7.json    # Unit 7: React Fundamentals (78 questions)
    ├── data_u8.json    # Unit 8: React Hooks (68 questions)
    ├── data_u9.json    # Unit 9: MongoDB (56 questions)
    └── data_u10.json   # Unit 10: Mongoose & MERN (40 questions)
```

## How to Run

### Using a Local Server (Required for fetch to work)
```bash
cd fsd2-portal
python -m http.server 8000
# Visit http://localhost:8000
```

### Using VS Code Live Server
- Install the Live Server extension
- Right-click on `index.html` → Open with Live Server

### Using Node.js
```bash
npx serve fsd2-portal
```

## Responsive Breakpoints

- **Very Small Phones**: < 360px
- **Small Phones**: < 520px (single column, touch-friendly)
- **Medium Phones**: 521px - 768px
- **Tablets**: 600px - 1023px (2-column options)
- **Desktop**: ≥ 1024px (full layout with terminal sidebar)

## Tech Stack

- HTML5, CSS3, JavaScript (Vanilla)
- Font Awesome 6.5 for icons
- Google Fonts (Oxanium, Outfit, Fira Code)

## Bugs Fixed

See [BUGS_FIXED.md](BUGS_FIXED.md) for the complete list of all 30+ bugs found and fixed.

## License

© 2026 LJ United Networks · Dixit Patel