import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, RotateCcw, Shuffle, Star } from 'lucide-react'
import clsx from 'clsx'
import { useProgressContext } from '../App'
import { getTermStatus } from '../utils/study'

function shuffleTerms(terms) {
  const copy = [...terms]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function Flashcards({ unit, terms }) {
  const { progress, markTerm } = useProgressContext()
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [shuffleSeed, setShuffleSeed] = useState(0)
  const [learningOnly, setLearningOnly] = useState(false)

  const studyTerms = useMemo(() => {
    const scoped = learningOnly
      ? terms.filter(term => getTermStatus(progress, term.id) === 'learning')
      : terms
    return shuffleSeed > 0 ? shuffleTerms(scoped) : scoped
  }, [terms, progress, learningOnly, shuffleSeed])

  const term = studyTerms[index]
  const status = term ? getTermStatus(progress, term.id) : 'unmarked'

  useEffect(() => {
    setIndex(0)
    setFlipped(false)
  }, [terms, learningOnly, shuffleSeed])

  useEffect(() => {
    function handleKeyDown(event) {
      if (!term) return
      if (event.target instanceof HTMLInputElement) return

      if (event.code === 'Space') {
        event.preventDefault()
        setFlipped(value => !value)
      }
      if (event.key === 'ArrowRight') goTo(index + 1)
      if (event.key === 'ArrowLeft') goTo(index - 1)
      if (event.key === '1') markTerm(term.id, 'learning')
      if (event.key === '2') markTerm(term.id, 'known')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [index, markTerm, term])

  function goTo(next) {
    if (studyTerms.length === 0) return
    setFlipped(false)
    setIndex((next + studyTerms.length) % studyTerms.length)
  }

  if (studyTerms.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <p className="font-medium text-slate-950">No cards in this study set.</p>
        <p className="mt-1 text-sm text-slate-500">
          Turn off learning-only mode or choose a broader section.
        </p>
        {learningOnly && (
          <button
            onClick={() => setLearningOnly(false)}
            className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Show all cards
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Card {index + 1} of {studyTerms.length}
          </p>
          <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${((index + 1) / studyTerms.length) * 100}%`,
                backgroundColor: unit.accentColor,
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setLearningOnly(value => !value)}
            className={clsx(
              'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition',
              learningOnly
                ? 'border-amber-200 bg-amber-50 text-amber-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            )}
          >
            <Star size={16} />
            Learning only
          </button>
          <button
            onClick={() => setShuffleSeed(seed => seed + 1)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300"
          >
            <Shuffle size={16} />
            Shuffle
          </button>
        </div>
      </div>

      <button
        className="flip-card h-[24rem] w-full cursor-pointer text-left"
        onClick={() => setFlipped(value => !value)}
      >
        <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
          <div className="flip-card-face rounded-3xl border border-slate-200 bg-slate-950 p-8 text-white shadow-xl shadow-slate-200">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">
                  {term.unitSubsection}
                </span>
                <span className="text-xs text-slate-400">Space to flip</span>
              </div>
              <div className="flex flex-1 items-center">
                <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{term.term}</h2>
              </div>
              <p className="text-sm text-slate-400">Tap or press space to reveal the definition.</p>
            </div>
          </div>

          <div className="flip-card-face flip-card-back rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200">
            <div className="flex h-full flex-col">
              <span className="mb-5 w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                {term.term}
              </span>
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-2xl font-semibold leading-snug text-slate-950">{term.definition}</p>
                <p className="mt-5 text-base leading-7 text-slate-500">{term.example}</p>
              </div>
            </div>
          </div>
        </div>
      </button>

      <div className="grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <button
          onClick={() => goTo(index - 1)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
        >
          <ArrowLeft size={17} />
          Previous
        </button>

        <div className="flex justify-center gap-2">
          <button
            onClick={() => markTerm(term.id, status === 'learning' ? null : 'learning')}
            className={clsx(
              'inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition',
              status === 'learning'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
            )}
          >
            <RotateCcw size={17} />
            Again
          </button>
          <button
            onClick={() => markTerm(term.id, status === 'known' ? null : 'known')}
            className={clsx(
              'inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition',
              status === 'known'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-950 text-white hover:bg-slate-800'
            )}
          >
            <Check size={17} />
            Known
          </button>
        </div>

        <button
          onClick={() => goTo(index + 1)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
        >
          Next
          <ArrowRight size={17} />
        </button>
      </div>

      <p className="text-center text-xs text-slate-400">
        Keyboard: space flips, arrow keys move, 1 marks learning, 2 marks known.
      </p>
    </div>
  )
}
