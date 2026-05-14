import React from 'react'
import { useProgressContext } from '../App'

export default function Browse({ unit }) {
  const { progress, markTerm } = useProgressContext()

  return (
    <div className="space-y-4">
      {unit.terms.map(term => {
        const status = progress[term.id]
        return (
          <div
            key={term.id}
            className="rounded-lg bg-[#141414] border border-[#2a2a2a] p-5"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <span className="text-xs text-[#8a8480] font-mono">{term.unitSubsection}</span>
                <h3 className="font-serif text-2xl font-semibold leading-tight">{term.term}</h3>
              </div>
              <div className="flex gap-2 flex-shrink-0 mt-1">
                <button
                  onClick={() => markTerm(term.id, status === 'known' ? null : 'known')}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    status === 'known'
                      ? 'bg-emerald-900/50 border-emerald-600 text-emerald-300'
                      : 'border-[#2a2a2a] text-[#8a8480] hover:border-emerald-700 hover:text-emerald-400'
                  }`}
                >
                  Known
                </button>
                <button
                  onClick={() => markTerm(term.id, status === 'learning' ? null : 'learning')}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    status === 'learning'
                      ? 'bg-amber-900/50 border-amber-600 text-amber-300'
                      : 'border-[#2a2a2a] text-[#8a8480] hover:border-amber-700 hover:text-amber-400'
                  }`}
                >
                  Learning
                </button>
              </div>
            </div>
            <p className="text-[#c0bab2] mb-2">{term.definition}</p>
            <p className="text-sm text-[#8a8480] italic">"{term.example}"</p>
          </div>
        )
      })}
    </div>
  )
}
