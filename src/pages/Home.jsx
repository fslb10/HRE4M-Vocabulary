import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Layers3,
  Play,
  Sparkles,
  Target,
} from 'lucide-react'
import units from '../data/vocabulary'
import { useProgressContext } from '../App'
import { getCourseStats, getStudyQueue, getUnitStats } from '../utils/study'

function Metric({ icon: Icon, label, value, tone = 'ink' }) {
  const tones = {
    ink: 'bg-slate-100 text-slate-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon size={20} />
      </div>
      <p className="text-2xl font-semibold text-slate-950">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  )
}

function UnitCard({ unit, progress }) {
  const stats = getUnitStats(unit, progress)

  return (
    <Link
      to={`/unit/${unit.id}`}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div
            className="mb-3 h-2 w-12 rounded-full"
            style={{ backgroundColor: unit.accentColor }}
          />
          <h2 className="text-lg font-semibold leading-snug text-slate-950">{unit.title}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
            {unit.description || `${stats.total} vocabulary terms for review and practice.`}
          </p>
        </div>
        <ArrowRight
          size={20}
          className="mt-1 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">{stats.known} of {stats.total} known</span>
          <span className="font-medium text-slate-800">{stats.pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${stats.pct}%`, backgroundColor: unit.accentColor }}
          />
        </div>
        <div className="flex gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2.5 py-1">{stats.learning} learning</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1">{stats.unmarked} new</span>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const { progress } = useProgressContext()
  const courseStats = getCourseStats(units, progress)
  const queue = getStudyQueue(units, progress)
  const continueUnit = units.find(unit => getUnitStats(unit, progress).pct < 100) || units[0]
  const continueStats = getUnitStats(continueUnit, progress)

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.55fr_0.95fr]">
        <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl shadow-slate-200">
          <div className="mb-10 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
              <Sparkles size={20} />
            </span>
            <span className="text-sm font-medium text-slate-300">HRE4M1 Study Workspace</span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Build recall, not just a word list.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Review course vocabulary by unit, section, confidence level, and quiz performance.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/unit/${continueUnit.id}?tab=Flashcards`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              <Play size={17} />
              Continue studying
            </Link>
            <Link
              to={`/unit/${continueUnit.id}?tab=Quiz`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Target size={17} />
              Start quiz
            </Link>
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-1 text-sm font-medium text-slate-500">Continue</p>
          <h2 className="text-2xl font-semibold text-slate-950">{continueUnit.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {continueStats.learning > 0
              ? `${continueStats.learning} terms are marked learning.`
              : `${continueStats.unmarked} terms are still new.`}
          </p>

          <div className="my-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-500">Unit mastery</span>
              <span className="font-medium text-slate-900">{continueStats.pct}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{ width: `${continueStats.pct}%`, backgroundColor: continueUnit.accentColor }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-lg font-semibold text-slate-950">{continueStats.known}</p>
              <p className="text-xs text-slate-500">Known</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3">
              <p className="text-lg font-semibold text-amber-700">{continueStats.learning}</p>
              <p className="text-xs text-amber-700/70">Learning</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-lg font-semibold text-slate-950">{continueStats.unmarked}</p>
              <p className="text-xs text-slate-500">New</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Metric icon={Layers3} label="Total terms" value={courseStats.total} />
        <Metric icon={CheckCircle2} label="Known terms" value={courseStats.known} tone="green" />
        <Metric icon={BookOpen} label="Still learning" value={courseStats.learning} tone="amber" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Units</h2>
              <p className="text-sm text-slate-500">Choose a unit, then narrow by section or study mode.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {units.map(unit => (
              <UnitCard key={unit.id} unit={unit} progress={progress} />
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-950">Study Queue</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
              {queue.length} terms
            </span>
          </div>
          <div className="space-y-3">
            {queue.slice(0, 6).map(term => (
              <Link
                key={term.id}
                to={`/unit/${term.unitId}`}
                className="block rounded-xl border border-slate-100 p-3 transition hover:border-slate-200 hover:bg-slate-50"
              >
                <p className="font-medium text-slate-900">{term.term}</p>
                <p className="mt-1 text-xs text-slate-500">{term.unitTitle} · {term.unitSubsection}</p>
              </Link>
            ))}
            {queue.length === 0 && (
              <p className="rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                Everything is marked known. Nice work.
              </p>
            )}
          </div>
        </aside>
      </section>
    </div>
  )
}
