import React, { useState } from 'react'
import { useProgressContext } from '../App'

export default function Flashcards({ unit }) {
  const { progress, markTerm } = useProgressContext()
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const terms = unit.terms
  const term = terms[index]
  const status = progress[term.id]

  function goTo(next) {
    setFlipped(false)
    // Brief delay so the card resets before the content changes
    setTimeout(() => setIndex(next), 50)
  }

  return (
    <div className="flex flex-col items-center">
      <p className="text-[#8a8480] text-sm mb-6">
        Card {index + 1} of {terms.length}
      </p>

      {/* Flip card container */}
      <div
        className="flip-card w-full max-w-lg cursor-pointer"
        style={{ height: '280px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
          {/* Front: term */}
          <div
            className="flip-card-face rounded-xl border-2 bg-[#141414] flex flex-col items-center justify-center p-8 text-center"
            style={{ borderColor: unit.accentColor }}
          >
            <span className="text-xs text-[#8a8480] font-mono mb-3">{term.unitSubsection}</span>
            <h2 className="font-serif text-4xl font-semibold">{term.term}</h2>
            <span className="text-[#8a8480] text-xs mt-4">Click to reveal</span>
          </div>

          {/* Back: definition */}
          <div
            className="flip-card-face flip-card-back rounded-xl border-2 bg-[#141414] flex flex-col items-center justify-center p-8 text-center"
            style={{ borderColor: unit.accentColor }}
          >
            <p className="text-[#c0bab2] text-lg leading-relaxed mb-4">{term.definition}</p>
            <p className="text-sm text-[#8a8480] italic">"{term.example}"</p>
          </div>
        </div>
      </div>

      {/* Mark buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => markTerm(term.id, status === 'known' ? null : 'known')}
          className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
            status === 'known'
              ? 'bg-emerald-900/50 border-emerald-600 text-emerald-300'
              : 'border-[#2a2a2a] text-[#8a8480] hover:border-emerald-700 hover:text-emerald-400'
          }`}
        >
          Known
        </button>
        <button
          onClick={() => markTerm(term.id, status === 'learning' ? null : 'learning')}
          className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
            status === 'learning'
              ? 'bg-amber-900/50 border-amber-600 text-amber-300'
              : 'border-[#2a2a2a] text-[#8a8480] hover:border-amber-700 hover:text-amber-400'
          }`}
        >
          Still Learning
        </button>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => goTo((index - 1 + terms.length) % terms.length)}
          className="px-6 py-2 rounded bg-[#2a2a2a] hover:bg-[#333] text-sm font-medium transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => goTo((index + 1) % terms.length)}
          className="px-6 py-2 rounded bg-[#2a2a2a] hover:bg-[#333] text-sm font-medium transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}
