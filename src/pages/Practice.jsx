import React, { useMemo, useState } from 'react'
import { ArrowUpDown, CheckCircle2, ListChecks, PencilLine, RefreshCcw, SplitSquareHorizontal } from 'lucide-react'
import clsx from 'clsx'
import { useProgressContext } from '../App'

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const MODES = [
  { id: 'match', label: 'Match', icon: SplitSquareHorizontal },
  { id: 'blank', label: 'Fill blank', icon: PencilLine },
  { id: 'timeline', label: 'Timeline', icon: ArrowUpDown },
  { id: 'section', label: 'Subsection', icon: ListChecks },
]

function PracticeShell({ mode, setMode, children }) {
  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {MODES.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setMode(item.id)}
              className={clsx(
                'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition',
                mode === item.id
                  ? 'border-slate-950 bg-slate-950 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
            >
              <Icon size={16} />
              {item.label}
            </button>
          )
        })}
      </div>
      {children}
    </div>
  )
}

function MatchingGame({ terms, recordReview }) {
  const pairs = useMemo(() => shuffle(terms).slice(0, 6), [terms])
  const definitions = useMemo(() => shuffle(pairs), [pairs])
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [matched, setMatched] = useState([])
  const [message, setMessage] = useState('Select a term, then match its definition.')

  function chooseDefinition(term) {
    if (!selectedTerm || matched.includes(term.id)) return
    const correct = selectedTerm.id === term.id
    setMessage(correct ? 'Match found.' : 'Not quite. Try another definition.')
    recordReview(selectedTerm.id, correct)
    if (correct) {
      setMatched(value => [...value, term.id])
      setSelectedTerm(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-600">{message}</p>
        <span className="text-sm text-slate-500">{matched.length}/{pairs.length}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          {pairs.map(term => (
            <button
              key={term.id}
              onClick={() => setSelectedTerm(term)}
              disabled={matched.includes(term.id)}
              className={clsx(
                'w-full rounded-2xl border p-4 text-left text-sm font-semibold transition',
                matched.includes(term.id) && 'border-emerald-200 bg-emerald-50 text-emerald-700',
                selectedTerm?.id === term.id && !matched.includes(term.id) && 'border-slate-950 bg-slate-950 text-white',
                selectedTerm?.id !== term.id && !matched.includes(term.id) && 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
              )}
            >
              {term.term}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {definitions.map(term => (
            <button
              key={term.id}
              onClick={() => chooseDefinition(term)}
              disabled={matched.includes(term.id)}
              className={clsx(
                'w-full rounded-2xl border p-4 text-left text-sm leading-6 transition',
                matched.includes(term.id)
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              {term.definition}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function FillBlank({ terms, recordReview }) {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)
  const quizTerms = useMemo(() => shuffle(terms).slice(0, 8), [terms])
  const term = quizTerms[index]

  function checkAnswer(event) {
    event.preventDefault()
    const correct = answer.trim().toLowerCase() === term.term.toLowerCase()
    setResult(correct)
    recordReview(term.id, correct)
  }

  function next() {
    setAnswer('')
    setResult(null)
    setIndex(value => (value + 1) % quizTerms.length)
  }

  return (
    <form onSubmit={checkAnswer} className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Type the term</p>
        <p className="mt-3 text-2xl font-semibold leading-snug text-slate-950">{term.definition}</p>
      </div>
      <input
        value={answer}
        onChange={event => setAnswer(event.target.value)}
        className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-lg outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
        placeholder="Enter the vocabulary term"
      />
      {result !== null && (
        <div className={clsx('rounded-2xl p-4 text-sm', result ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800')}>
          {result ? 'Correct.' : `Correct answer: ${term.term}`}
        </div>
      )}
      <div className="flex justify-end gap-2">
        <button type="submit" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white">
          Check
        </button>
        <button type="button" onClick={next} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700">
          Next
        </button>
      </div>
    </form>
  )
}

function TimelineOrder({ sections }) {
  const [picked, setPicked] = useState([])
  const [checked, setChecked] = useState(false)
  const options = useMemo(() => shuffle(sections), [sections])
  const correct = picked.length === sections.length && picked.every((section, index) => section.id === sections[index].id)

  function pick(section) {
    if (picked.some(item => item.id === section.id) || checked) return
    setPicked(value => [...value, section])
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-950">Choose sections in historical order</p>
        {options.map(section => (
          <button
            key={section.id}
            onClick={() => pick(section)}
            disabled={picked.some(item => item.id === section.id)}
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm transition hover:border-slate-300 disabled:opacity-40"
          >
            <span className="font-semibold">{section.id}</span> {section.title}
          </button>
        ))}
      </div>
      <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-950">Your timeline</p>
          <button onClick={() => { setPicked([]); setChecked(false) }} className="text-slate-500">
            <RefreshCcw size={17} />
          </button>
        </div>
        {picked.map((section, index) => (
          <div key={section.id} className="rounded-xl bg-white p-3 text-sm">
            {index + 1}. {section.title}
          </div>
        ))}
        <button
          onClick={() => setChecked(true)}
          disabled={picked.length !== sections.length}
          className="w-full rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          Check order
        </button>
        {checked && (
          <p className={clsx('rounded-xl p-3 text-sm', correct ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800')}>
            {correct ? 'Correct timeline.' : 'Some sections are out of order. Reset and try again.'}
          </p>
        )}
      </div>
    </div>
  )
}

function SectionQuiz({ terms, sections, recordReview }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const quizTerms = useMemo(() => shuffle(terms).slice(0, 8), [terms])
  const term = quizTerms[index]
  const correct = selected === term.unitSubsection

  function choose(sectionId) {
    if (selected) return
    setSelected(sectionId)
    recordReview(term.id, sectionId === term.unitSubsection)
  }

  function next() {
    setSelected(null)
    setIndex(value => (value + 1) % quizTerms.length)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Which subsection?</p>
        <p className="mt-3 text-3xl font-semibold text-slate-950">{term.term}</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">{term.definition}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => choose(section.id)}
            className={clsx(
              'rounded-2xl border p-4 text-left text-sm transition',
              !selected && 'border-slate-200 bg-white hover:border-slate-300',
              selected && section.id === term.unitSubsection && 'border-emerald-200 bg-emerald-50 text-emerald-800',
              selected === section.id && !correct && 'border-red-200 bg-red-50 text-red-800',
              selected && selected !== section.id && section.id !== term.unitSubsection && 'border-slate-200 bg-white text-slate-400'
            )}
          >
            <span className="font-semibold">{section.id}</span> {section.title}
          </button>
        ))}
      </div>
      {selected && (
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <CheckCircle2 size={17} />
            {correct ? 'Correct.' : `Correct section: ${term.unitSubsection}`}
          </span>
          <button onClick={next} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default function Practice({ terms, sections }) {
  const { recordReview } = useProgressContext()
  const [mode, setMode] = useState('match')

  if (terms.length < 2) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <p className="font-medium text-slate-950">Practice needs at least two terms.</p>
        <p className="mt-1 text-sm text-slate-500">Choose all sections or a larger subsection.</p>
      </div>
    )
  }

  return (
    <PracticeShell mode={mode} setMode={setMode}>
      {mode === 'match' && <MatchingGame terms={terms} recordReview={recordReview} />}
      {mode === 'blank' && <FillBlank terms={terms} recordReview={recordReview} />}
      {mode === 'timeline' && <TimelineOrder sections={sections} />}
      {mode === 'section' && <SectionQuiz terms={terms} sections={sections} recordReview={recordReview} />}
    </PracticeShell>
  )
}
