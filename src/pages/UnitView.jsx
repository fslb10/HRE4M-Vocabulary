import React, { useMemo, useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, CheckCircle2, ClipboardList, Layers3, Search } from 'lucide-react'
import clsx from 'clsx'
import units from '../data/vocabulary'
import Browse from './Browse'
import Flashcards from './Flashcards'
import Quiz from './Quiz'
import { useProgressContext } from '../App'
import { getUnitSections, getUnitStats } from '../utils/study'

const TABS = [
  { id: 'Browse', icon: Search },
  { id: 'Flashcards', icon: BookOpen },
  { id: 'Quiz', icon: ClipboardList },
]

export default function UnitView() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const unit = units.find(u => u.id === Number(id))
  const { progress } = useProgressContext()
  const [sectionId, setSectionId] = useState('all')
  const activeTab = TABS.some(tab => tab.id === searchParams.get('tab'))
    ? searchParams.get('tab')
    : 'Browse'

  const sections = useMemo(() => unit ? getUnitSections(unit) : [], [unit])
  const stats = unit ? getUnitStats(unit, progress) : null
  const visibleTerms = unit
    ? unit.terms.filter(term => sectionId === 'all' || term.unitSubsection === sectionId)
    : []

  function setActiveTab(tab) {
    setSearchParams(tab === 'Browse' ? {} : { tab })
  }

  if (!unit) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-slate-500">Unit not found.</p>
        <Link to="/" className="font-medium text-slate-950 underline">Back to home</Link>
      </div>
    )
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

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div>
            <div
              className="mb-4 h-2 w-16 rounded-full"
              style={{ backgroundColor: unit.accentColor }}
            />
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {unit.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              {unit.description || 'Browse the vocabulary, review with flashcards, or test yourself with a quiz.'}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-600">Mastery</span>
              <span className="font-semibold text-slate-950">{stats.pct}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${stats.pct}%`, backgroundColor: unit.accentColor }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-semibold text-slate-950">{stats.total}</p>
                <p className="text-xs text-slate-500">Terms</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-emerald-700">{stats.known}</p>
                <p className="text-xs text-slate-500">Known</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-amber-700">{stats.learning}</p>
                <p className="text-xs text-slate-500">Learning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Layers3 size={17} />
          Study sections
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSectionId('all')}
            className={clsx(
              'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition',
              sectionId === 'all'
                ? 'border-slate-950 bg-slate-950 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            )}
          >
            All sections
          </button>
          {sections.map(section => {
            const sectionTerms = unit.terms.filter(term => term.unitSubsection === section.id)
            return (
              <button
                key={section.id}
                onClick={() => setSectionId(section.id)}
                className={clsx(
                  'shrink-0 rounded-full border px-4 py-2 text-left text-sm transition',
                  sectionId === section.id
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                )}
              >
                <span className="font-semibold">{section.id}</span>
                <span className="ml-2">{section.title}</span>
                <span className="ml-2 opacity-60">{sectionTerms.length}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex gap-1 border-b border-slate-200 p-2">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition sm:flex-none',
                  activeTab === tab.id
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'
                )}
              >
                <Icon size={17} />
                {tab.id}
              </button>
            )
          })}
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'Browse' && <Browse unit={unit} terms={visibleTerms} sections={sections} />}
          {activeTab === 'Flashcards' && <Flashcards unit={unit} terms={visibleTerms} />}
          {activeTab === 'Quiz' && <Quiz unit={unit} terms={visibleTerms} />}
        </div>
      </section>

      {activeTab !== 'Browse' && visibleTerms.length < 4 && (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This section has a small term set, so quizzes may use fewer answer choices.
        </p>
      )}
    </div>
  )
}
