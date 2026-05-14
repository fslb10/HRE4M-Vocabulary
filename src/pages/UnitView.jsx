import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import units from '../data/vocabulary'
import Browse from './Browse'
import Flashcards from './Flashcards'
import Quiz from './Quiz'

const TABS = ['Browse', 'Flashcards', 'Quiz']

export default function UnitView() {
  const { id } = useParams()
  const unit = units.find(u => u.id === Number(id))
  const [activeTab, setActiveTab] = useState('Browse')

  if (!unit) {
    return (
      <div className="text-center py-20">
        <p className="text-[#8a8480] mb-4">Unit not found.</p>
        <Link to="/" className="underline">Back to home</Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/" className="text-[#8a8480] hover:text-[#f0ece4] text-sm transition-colors">
        Back to units
      </Link>
      <div className="mt-4 mb-6 flex items-center gap-3">
        <div
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: unit.accentColor }}
        />
        <h1 className="font-serif text-3xl font-semibold">{unit.title}</h1>
      </div>

      <div className="flex gap-1 mb-8 border-b border-[#2a2a2a]">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-current text-[#f0ece4]'
                : 'border-transparent text-[#8a8480] hover:text-[#f0ece4]'
            }`}
            style={activeTab === tab ? { borderColor: unit.accentColor } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Browse' && <Browse unit={unit} />}
      {activeTab === 'Flashcards' && <Flashcards unit={unit} />}
      {activeTab === 'Quiz' && <Quiz unit={unit} />}
    </div>
  )
}
