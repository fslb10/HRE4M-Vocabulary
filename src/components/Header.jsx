import React from 'react'
import { Link } from 'react-router-dom'

export default function Header({ onResetClick }) {
  return (
    <header className="border-b border-[#2a2a2a] bg-[#0a0a0a] sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl font-semibold tracking-wide hover:text-white transition-colors">
          HRE4M1 Vocabulary
        </Link>
        <button
          onClick={onResetClick}
          className="text-sm text-[#8a8480] hover:text-[#f0ece4] transition-colors"
        >
          Reset Progress
        </button>
      </div>
    </header>
  )
}
