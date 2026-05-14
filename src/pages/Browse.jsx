import React, { useMemo, useState } from 'react'
import { Check, Circle, Search, Star } from 'lucide-react'
import clsx from 'clsx'
import { useProgressContext } from '../App'
import { dueLabel, getTermRecord, getTermStatus } from '../utils/study'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'unmarked', label: 'New' },
  { id: 'learning', label: 'Learning' },
  { id: 'known', label: 'Known' },
]

function StatusButton({ active, children, onClick, tone }) {
  const tones = {
    known: active
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : 'border-slate-200 text-slate-500 hover:border-emerald-200 hover:text-emerald-700',
    learning: active
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : 'border-slate-200 text-slate-500 hover:border-amber-200 hover:text-amber-700',
  }

  return (
    <button
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition',
        tones[tone]
      )}
    >
      {children}
    </button>
  )
}

export default function Browse({ unit, terms, sections }) {
  const { progress, markTerm } = useProgressContext()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const sectionTitles = useMemo(() => {
    return Object.fromEntries(sections.map(section => [section.id, section.title]))
  }, [sections])

  const filteredTerms = terms.filter(term => {
    const status = getTermStatus(progress, term.id)
    const matchesStatus = statusFilter === 'all' || status === statusFilter
    const needle = query.trim().toLowerCase()
    const matchesQuery = !needle
      || term.term.toLowerCase().includes(needle)
      || term.definition.toLowerCase().includes(needle)
      || term.example.toLowerCase().includes(needle)

    return matchesStatus && matchesQuery
  })

  const groups = useMemo(() => {
    return filteredTerms.reduce((acc, term) => {
      const key = term.unitSubsection || 'Terms'
      acc[key] = acc[key] || []
      acc[key].push(term)
      return acc
    }, {})
  }, [filteredTerms])

  return (
    <div className="space-y-5">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <label className="relative block">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search terms, definitions, or examples"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map(filter => (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id)}
              className={clsx(
                'rounded-full border px-4 py-2 text-sm font-medium transition',
                statusFilter === filter.id
                  ? 'border-slate-950 bg-slate-950 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groups).map(([sectionId, sectionTerms]) => (
          <section key={sectionId} className="space-y-3">
            <div className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: unit.accentColor }}
              />
              <div>
                <h3 className="font-semibold text-slate-950">
                  {sectionId} {sectionTitles[sectionId] ? `- ${sectionTitles[sectionId]}` : ''}
                </h3>
                <p className="text-xs text-slate-500">{sectionTerms.length} term{sectionTerms.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
              {sectionTerms.map(term => {
                const status = getTermStatus(progress, term.id)
                const record = getTermRecord(progress, term.id)
                return (
                  <article key={term.id} className="p-4 transition hover:bg-slate-50 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">{term.unitSubsection}</span>
                          {status === 'known' && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Known</span>}
                          {status === 'learning' && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Learning</span>}
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{dueLabel(progress, term.id)}</span>
                        </div>
                        <h4 className="text-xl font-semibold tracking-tight text-slate-950">{term.term}</h4>
                        <p className="mt-2 max-w-3xl leading-7 text-slate-600">{term.definition}</p>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{term.example}</p>
                        {record && (
                          <p className="mt-2 text-xs text-slate-400">
                            Correct {record.timesCorrect || 0} - missed {record.timesMissed || 0}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <StatusButton
                          tone="learning"
                          active={status === 'learning'}
                          onClick={() => markTerm(term.id, status === 'learning' ? null : 'learning')}
                        >
                          <Star size={14} />
                          Learning
                        </StatusButton>
                        <StatusButton
                          tone="known"
                          active={status === 'known'}
                          onClick={() => markTerm(term.id, status === 'known' ? null : 'known')}
                        >
                          {status === 'known' ? <Check size={14} /> : <Circle size={14} />}
                          Known
                        </StatusButton>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="font-medium text-slate-950">No terms match that filter.</p>
          <p className="mt-1 text-sm text-slate-500">Try a different search or progress status.</p>
        </div>
      )}
    </div>
  )
}
