import React, { useState, useMemo } from 'react'

// Fisher-Yates shuffle, returns a new array
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuestions(terms, count = 10) {
  const pool = shuffle(terms).slice(0, count)
  return pool.map(correct => {
    // Pick 3 distractors from the remaining terms
    const distractors = shuffle(terms.filter(t => t.id !== correct.id)).slice(0, 3)
    const options = shuffle([correct, ...distractors])
    return { correct, options }
  })
}

export default function Quiz({ unit }) {
  const [questions] = useState(() => buildQuestions(unit.terms))
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [restart, setRestart] = useState(0)

  // Rebuild questions when restarting
  const qs = useMemo(() => buildQuestions(unit.terms), [unit, restart])

  const q = qs[current]

  function choose(termId) {
    if (answered) return
    setSelected(termId)
    setAnswered(true)
    if (termId === q.correct.id) {
      setScore(s => s + 1)
    }
  }

  function next() {
    if (current + 1 >= qs.length) {
      setDone(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  function handleRestart() {
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setDone(false)
    setAnswered(false)
    setRestart(r => r + 1)
  }

  if (done) {
    const pct = Math.round((score / qs.length) * 100)
    return (
      <div className="flex flex-col items-center text-center py-12">
        <p className="text-[#8a8480] text-sm mb-2">Quiz complete</p>
        <p className="font-serif text-6xl font-semibold mb-1">{score}/{qs.length}</p>
        <p className="text-[#8a8480] mb-8">{pct}% correct</p>
        <button
          onClick={handleRestart}
          className="px-8 py-2 rounded bg-[#2a2a2a] hover:bg-[#333] text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <p className="text-[#8a8480] text-sm mb-6">
        Question {current + 1} of {qs.length}
      </p>

      <div className="rounded-lg bg-[#141414] border border-[#2a2a2a] p-6 mb-6">
        <p className="text-xs text-[#8a8480] mb-2 font-mono">Definition</p>
        <p className="text-lg leading-relaxed">{q.correct.definition}</p>
      </div>

      <div className="space-y-3 mb-6">
        {q.options.map(opt => {
          let cls = 'w-full text-left px-5 py-3 rounded-lg border text-sm transition-colors '
          if (!answered) {
            cls += 'border-[#2a2a2a] hover:border-[#8a8480] bg-[#141414]'
          } else if (opt.id === q.correct.id) {
            cls += 'border-emerald-600 bg-emerald-900/30 text-emerald-200'
          } else if (opt.id === selected) {
            cls += 'border-red-700 bg-red-900/30 text-red-300'
          } else {
            cls += 'border-[#2a2a2a] bg-[#141414] text-[#8a8480]'
          }
          return (
            <button key={opt.id} className={cls} onClick={() => choose(opt.id)}>
              <span className="font-serif text-base">{opt.term}</span>
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="flex justify-end">
          <button
            onClick={next}
            className="px-6 py-2 rounded bg-[#2a2a2a] hover:bg-[#333] text-sm font-medium transition-colors"
          >
            {current + 1 < qs.length ? 'Next' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  )
}
