import React, { useMemo, useState } from 'react'
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import clsx from 'clsx'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuestions(terms, mode, count = 10) {
  const pool = shuffle(terms).slice(0, Math.min(count, terms.length))
  return pool.map((correct, index) => {
    const questionMode = mode === 'mixed'
      ? index % 2 === 0 ? 'definition' : 'term'
      : mode
    const distractors = shuffle(terms.filter(term => term.id !== correct.id)).slice(0, 3)
    const options = questionMode === 'definition'
      ? shuffle([correct, ...distractors]).map(term => ({
        id: term.id,
        label: term.term,
      }))
      : shuffle([correct, ...distractors]).map(term => ({
        id: term.id,
        label: term.definition,
      }))

    return { correct, options, questionMode }
  })
}

const MODES = [
  { id: 'definition', label: 'Definition to term' },
  { id: 'term', label: 'Term to definition' },
  { id: 'mixed', label: 'Mixed' },
]

export default function Quiz({ unit, terms }) {
  const [mode, setMode] = useState('definition')
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [restart, setRestart] = useState(0)
  const [missed, setMissed] = useState([])

  const questions = useMemo(() => buildQuestions(terms, mode), [terms, mode, restart])
  const q = questions[current]
  const progress = questions.length > 0 ? ((current + (answered ? 1 : 0)) / questions.length) * 100 : 0

  function choose(optionId) {
    if (answered) return
    setSelected(optionId)
    setAnswered(true)
    if (optionId === q.correct.id) {
      setScore(value => value + 1)
    } else {
      setMissed(value => [...value, q.correct])
    }
  }

  function next() {
    if (current + 1 >= questions.length) {
      setDone(true)
    } else {
      setCurrent(value => value + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  function reset(nextMode = mode) {
    setMode(nextMode)
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setDone(false)
    setAnswered(false)
    setMissed([])
    setRestart(value => value + 1)
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <p className="font-medium text-slate-950">No quiz terms available.</p>
        <p className="mt-1 text-sm text-slate-500">Choose a broader section to start a quiz.</p>
      </div>
    )
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl bg-slate-950 p-8 text-center text-white">
          <p className="text-sm font-medium text-slate-300">Quiz complete</p>
          <p className="mt-3 text-6xl font-semibold">{score}/{questions.length}</p>
          <p className="mt-2 text-slate-300">{pct}% correct</p>
          <button
            onClick={() => reset()}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            <RotateCcw size={17} />
            Try again
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-950">Review next</h3>
          {missed.length > 0 ? (
            <div className="mt-4 space-y-3">
              {missed.map(term => (
                <div key={`${term.id}-${restart}`} className="rounded-xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-950">{term.term}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{term.definition}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
              No missed terms in this round.
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Question {current + 1} of {questions.length}
          </p>
          <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: unit.accentColor }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {MODES.map(item => (
            <button
              key={item.id}
              onClick={() => reset(item.id)}
              className={clsx(
                'rounded-full border px-3 py-2 text-xs font-semibold transition',
                mode === item.id
                  ? 'border-slate-950 bg-slate-950 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {q.questionMode === 'definition' ? 'Choose the term' : 'Choose the definition'}
        </p>
        <p className="text-2xl font-semibold leading-snug text-slate-950">
          {q.questionMode === 'definition' ? q.correct.definition : q.correct.term}
        </p>
      </div>

      <div className="grid gap-3">
        {q.options.map(option => {
          const isCorrect = option.id === q.correct.id
          const isSelected = option.id === selected
          return (
            <button
              key={option.id}
              onClick={() => choose(option.id)}
              className={clsx(
                'flex items-start gap-3 rounded-2xl border p-4 text-left text-sm leading-6 transition',
                !answered && 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                answered && isCorrect && 'border-emerald-200 bg-emerald-50 text-emerald-900',
                answered && isSelected && !isCorrect && 'border-red-200 bg-red-50 text-red-900',
                answered && !isSelected && !isCorrect && 'border-slate-200 bg-white text-slate-400'
              )}
            >
              {answered && isCorrect && <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600" />}
              {answered && isSelected && !isCorrect && <XCircle size={20} className="mt-0.5 shrink-0 text-red-600" />}
              {(!answered || (!isSelected && !isCorrect)) && (
                <span className="mt-1 h-3 w-3 shrink-0 rounded-full border border-current opacity-40" />
              )}
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-950">
            {selected === q.correct.id ? 'Correct.' : `Correct answer: ${q.correct.term}`}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{q.correct.example}</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={next}
              className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {current + 1 < questions.length ? 'Next question' : 'See results'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
