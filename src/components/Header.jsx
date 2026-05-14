import React from 'react'
import { Link } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'

export default function Header({ onResetClick }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f7f5ef]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-sm">
            H
          </span>
          <span>
            <span className="block text-base font-semibold tracking-tight text-slate-950 group-hover:text-slate-700">
              HRE4M1 Vocabulary
            </span>
            <span className="block text-xs text-slate-500">Study, quiz, and review</span>
          </span>
        </Link>

        <button
          onClick={onResetClick}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </header>
  )
}
