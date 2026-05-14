import React from 'react'
import { Link } from 'react-router-dom'
import units from '../data/vocabulary'
import { useProgressContext } from '../App'

function UnitCard({ unit, progress }) {
  const total = unit.terms.length
  const known = unit.terms.filter(t => progress[t.id] === 'known').length
  const pct = total > 0 ? Math.round((known / total) * 100) : 0

  return (
    <Link
      to={`/unit/${unit.id}`}
      className="block rounded-lg bg-[#141414] border-2 p-6 hover:bg-[#1a1a1a] transition-colors group"
      style={{ borderColor: unit.accentColor }}
    >
      <div
        className="w-3 h-3 rounded-full mb-4"
        style={{ backgroundColor: unit.accentColor }}
      />
      <h2 className="font-serif text-lg font-semibold leading-snug mb-1 group-hover:text-white transition-colors">
        {unit.title}
      </h2>
      <p className="text-[#8a8480] text-sm mb-4">
        {total} term{total !== 1 ? 's' : ''}
      </p>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-[#8a8480]">
          <span>{known} known</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1 rounded-full bg-[#2a2a2a] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: unit.accentColor }}
          />
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const { progress } = useProgressContext()

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-semibold mb-2">World Religions</h1>
        <p className="text-[#8a8480]">Select a unit to browse, practice flashcards, or take a quiz.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map(unit => (
          <UnitCard key={unit.id} unit={unit} progress={progress} />
        ))}
      </div>
    </div>
  )
}
