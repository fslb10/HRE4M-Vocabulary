import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle2, ClipboardList, Clock3, Play } from 'lucide-react'
import { dueLabel, getSectionStats, getTermStatus } from '../utils/study'

export default function Overview({ unit, progress }) {
  const sections = getSectionStats(unit, progress)
  const keyTerms = unit.terms.slice(0, 8)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <section>
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Clock3 size={17} />
            Study path
          </div>
          <div className="space-y-3">
            {sections.map((section, index) => (
              <article
                key={section.id}
                className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[3rem_1fr_auto]"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-white"
                  style={{ backgroundColor: unit.accentColor }}
                >
                  {index + 1}
                </div>
                <div>
                  <p className="text-xs font-mono text-slate-400">{section.id}</p>
                  <h3 className="font-semibold text-slate-950">{section.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{section.summary}</p>
                </div>
                <div className="min-w-28 text-left sm:text-right">
                  <p className="text-sm font-semibold text-slate-950">{section.pct}% known</p>
                  <p className="text-xs text-slate-500">{section.due} due</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white">
          <h3 className="font-semibold">Start here</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Preview the unit, then move into flashcards or quizzes when the terms feel familiar.
          </p>
          <div className="mt-4 grid gap-2">
            <Link
              to={`/unit/${unit.id}?tab=Flashcards`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950"
            >
              <Play size={16} />
              Flashcards
            </Link>
            <Link
              to={`/unit/${unit.id}?tab=Practice`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <ClipboardList size={16} />
              Practice modes
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen size={17} className="text-slate-500" />
            <h3 className="font-semibold text-slate-950">Key terms</h3>
          </div>
          <div className="space-y-3">
            {keyTerms.map(term => {
              const status = getTermStatus(progress, term.id)
              return (
                <div key={term.id} className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-slate-950">{term.term}</p>
                    {status === 'known' && <CheckCircle2 size={16} className="mt-0.5 text-emerald-600" />}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{dueLabel(progress, term.id)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </aside>
    </div>
  )
}
