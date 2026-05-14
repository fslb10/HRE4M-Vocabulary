import React, { useState, createContext, useContext } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useProgress } from './hooks/useProgress'
import Home from './pages/Home'
import UnitView from './pages/UnitView'
import Header from './components/Header'
import ResetModal from './components/ResetModal'

const ProgressContext = createContext(null)

export function useProgressContext() {
  return useContext(ProgressContext)
}

export default function App() {
  const { progress, markTerm, resetAll } = useProgress()
  const [showReset, setShowReset] = useState(false)

  return (
    <ProgressContext.Provider value={{ progress, markTerm, resetAll }}>
      <HashRouter>
        <div className="min-h-screen bg-[#f7f5ef] text-slate-950">
          <Header onResetClick={() => setShowReset(true)} />
          <main className="mx-auto max-w-6xl px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/unit/:id" element={<UnitView />} />
            </Routes>
          </main>
          {showReset && (
            <ResetModal
              onConfirm={() => { resetAll(); setShowReset(false) }}
              onCancel={() => setShowReset(false)}
            />
          )}
        </div>
      </HashRouter>
    </ProgressContext.Provider>
  )
}
