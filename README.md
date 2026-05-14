# HRE4M1 Vocabulary Study App

A clean React study app for HRE4M1 vocabulary. It includes a course dashboard, spaced repetition, a daily review page, unit progress tracking, searchable term browsing, filtered study sections, interactive flashcards, multiple quiz modes, practice games, and achievements. Progress is stored locally in the browser with `localStorage`.

## Tech Stack

- Vite + React (JavaScript)
- React Router (HashRouter for GitHub Pages compatibility)
- Tailwind CSS
- No backend. Progress persists in localStorage.

## Local Development

```bash
# Install dependencies
npm install

# Start dev server at http://localhost:5173
npm run dev

# Validate vocabulary data before deploying
npm run validate:vocab
```

## Adding or Editing Vocabulary

All terms live in `src/data/vocabulary.js`. Each unit follows this shape:

```js
{
  id: 0,
  title: 'Unit 0: Example',
  accentColor: '#2d6a4f',
  terms: [
    {
      id: 'u0t1',
      term: 'Example Term',
      definition: 'The definition goes here.',
      unitSubsection: '0.1',
      example: 'One sentence showing the term used in context.',
    },
  ],
}
```

Term IDs must be globally unique. A simple convention is `u{unitId}t{termIndex}`.

## Deploying to GitHub Pages

Push to `main`. The GitHub Actions workflow builds and deploys automatically.

The live site will be at `https://fslb10.github.io/HRE4M-Vocabulary/`.

For the first deploy, go to Settings > Pages in your repo and set Source to **GitHub Actions**.

## Repository Structure

```
src/
  data/
    vocabulary.js     Seed data. Replace with real terms here.
  hooks/
    useProgress.js    localStorage read/write for term progress.
  components/
    Header.jsx        Site header with Reset Progress button.
    ResetModal.jsx    Confirmation dialog for progress reset.
  pages/
    Home.jsx          Study dashboard, course metrics, achievements, unit cards, and queue.
    Review.jsx        Cross-unit daily review for due, learning, and new terms.
    UnitView.jsx      Unit workspace with overview, section filters, and study modes.
    Overview.jsx      Unit landing page with study path and key terms.
    Browse.jsx        Searchable, filterable term list with progress controls.
    Flashcards.jsx    Keyboard-friendly flip-card study mode.
    Quiz.jsx          Multiple-choice quiz with modes, feedback, and results.
    Practice.jsx      Matching, fill-blank, timeline, and subsection practice.
  utils/
    study.js          Progress helpers, spaced-review selectors, and data validation.
  App.jsx             Router, progress context provider.
  main.jsx            React entry point.
  index.css           Tailwind base + flip-card CSS.
```

## Resetting Progress

Click "Reset Progress" in the header. A confirmation modal will appear. Confirming clears the `hre4m1-vocab-progress` key from localStorage.
