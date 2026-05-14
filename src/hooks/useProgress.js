import { useState, useCallback } from 'react'

const STORAGE_KEY = 'hre4m1-vocab-progress'

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress)

  const markTerm = useCallback((termId, status) => {
    setProgress(prev => {
      const next = { ...prev }
      if (status) {
        next[termId] = status
      } else {
        delete next[termId]
      }
      saveProgress(next)
      return next
    })
  }, [])

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setProgress({})
  }, [])

  return { progress, markTerm, resetAll }
}
