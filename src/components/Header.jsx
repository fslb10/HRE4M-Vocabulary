import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Home, RotateCcw, CalendarClock } from 'lucide-react'
import clsx from 'clsx'

function navClass({ isActive }) {
  return clsx(
    'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition',
    isActive ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-white hover:text-slate-950'
  )
}

export default function Header({ onResetClick }) {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f7f5ef]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-sm">
              H
            </span>
            <span className="hidden sm:block">
              <span className="block text-base font-semibold tracking-tight text-slate-950 group-hover:text-slate-700">
                HRE4M1 Vocabulary
              </span>
              <span className="block text-xs text-slate-500">Study, quiz, and review</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full bg-slate-100 p-1 sm:flex">
            <NavLink to="/" className={navClass}>
              <Home size={16} />
              Dashboard
            </NavLink>
            <NavLink to="/review" className={navClass}>
              <CalendarClock size={16} />
              Review
            </NavLink>
          </nav>

          <button
            onClick={onResetClick}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      <nav className="fixed inset-x-4 bottom-4 z-30 grid grid-cols-2 gap-2 rounded-full border border-slate-200 bg-white/95 p-1 shadow-lg backdrop-blur sm:hidden">
        <NavLink to="/" className={navClass}>
          <Home size={16} />
          Dashboard
        </NavLink>
        <NavLink to="/review" className={navClass}>
          <CalendarClock size={16} />
          Review
        </NavLink>
      </nav>
    </>
  )
}
