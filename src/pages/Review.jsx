import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, CalendarClock, ClipboardList, Flame, Trophy } from 'lucide-react'
import clsx from 'clsx'
import units from '../data/vocabulary'
import { useProgressContext } from '../App'
import Flashcards from './Flashcards'
import Quiz from './Quiz'
import { getDueTerms, getProgressMeta, getStudyQueue } from '../utils/study'

export default function Review() {
  const { progress } = useProgressContext()
  const [mode, setMode] = useState('Flashcards')
  const meta = getProgressMeta(progress)
  const dueTerms = useMemo(() => getDueTerms(units, progress), [progress])
  const fallbackTerms = useMemo(() => getStudyQueue(units, progress).slice(0, 10), [progress])
  const reviewTerms = dueTerms.length > 0 ? dueTerms : fallbackTerms
  const reviewUnit = {
    id: 'review',
    title: 'Daily Review',
    accentColor: '#0f172a',
    terms: reviewTerms,
  }

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
      >
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl bg-slate-950 p-8 text-white">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <CalendarClock size={23} />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">Daily review</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            This pulls together terms that are due today, still learning, or new enough to revisit.
          </p>
        </div>

        <aside className="grid grid-cols-3 gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="rounded-2xl bg-slate-50 p-4 text-center">
            <Flame className="mx-auto text-orange-500" size={22} />
            <p className="mt-2 text-2xl font-semibold text-slate-950">{meta.currentStreak || 0}</p>
            <p className="text-xs text-slate-500">Streak</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-center">
            <Trophy className="mx-auto text-amber-500" size={22} />
            <p className="mt-2 text-2xl font-semibold text-slate-950">{meta.bestStreak || 0}</p>
            <p className="text-xs text-slate-500">Best</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-center">
            <BookOpen className="mx-auto text-slate-500" size={22} />
            <p className="mt-2 text-2xl font-semibold text-slate-950">{reviewTerms.length}</p>
            <p className="text-xs text-slate-500">Terms</p>
          </div>
        </aside>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex gap-1 border-b border-slate-200 p-2">
          {['Flashcards', 'Quiz'].map(item => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={clsx(
                'inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition sm:flex-none',
                mode === item ? 'bg-slate-950 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'
              )}
            >
              {item === 'Flashcards' ? <BookOpen size={17} /> : <ClipboardList size={17} />}
              {item}
            </button>
          ))}
        </div>
        <div className="p-4 sm:p-6">
          {reviewTerms.length > 0 ? (
            <>
              {mode === 'Flashcards' && <Flashcards unit={reviewUnit} terms={reviewTerms} />}
              {mode === 'Quiz' && <Quiz unit={reviewUnit} terms={reviewTerms} />}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="font-medium text-slate-950">No review terms yet.</p>
              <p className="mt-1 text-sm text-slate-500">Mark some terms as learning or known to start the spaced review cycle.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
