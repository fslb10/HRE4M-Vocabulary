# HRE4M1 Vocabulary Trainer

A dark-themed React SPA for studying world religion vocabulary. Features flashcards, multiple-choice quizzes, and per-term progress tracking stored in localStorage.

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
    Home.jsx          Unit grid with progress bars.
    UnitView.jsx      Tab container for Browse/Flashcards/Quiz.
    Browse.jsx        Scrollable term list with mark buttons.
    Flashcards.jsx    Flip-card review with navigation.
    Quiz.jsx          10-question multiple choice quiz.
  App.jsx             Router, progress context provider.
  main.jsx            React entry point.
  index.css           Tailwind base + flip-card CSS.
```

## Resetting Progress

Click "Reset Progress" in the header. A confirmation modal will appear. Confirming clears the `hre4m1-vocab-progress` key from localStorage.
