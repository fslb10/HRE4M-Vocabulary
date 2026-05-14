import { useCallback, useState } from 'react'

const STORAGE_KEY = 'hre4m1-vocab-progress'
const META_KEY = '__meta'

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function addDays(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return todayKey(date)
}

function daysBetween(a, b) {
  const one = new Date(`${a}T00:00:00`)
  const two = new Date(`${b}T00:00:00`)
  return Math.round((two - one) / 86400000)
}

function defaultMeta() {
  return {
    lastStudiedDate: null,
    currentStreak: 0,
    bestStreak: 0,
    totalSessions: 0,
    totalReviews: 0,
    quizzesTaken: 0,
    perfectQuizzes: 0,
    recentQuizzes: [],
  }
}

function migrateTermRecord(value) {
  if (!value) return null

  if (typeof value === 'string') {
    return {
      status: value,
      lastReviewed: null,
      nextReviewDate: value === 'known' ? addDays(3) : todayKey(),
      timesCorrect: value === 'known' ? 1 : 0,
      timesMissed: value === 'learning' ? 1 : 0,
    }
  }

  return {
    status: value.status || 'unmarked',
    lastReviewed: value.lastReviewed || null,
    nextReviewDate: value.nextReviewDate || todayKey(),
    timesCorrect: value.timesCorrect || 0,
    timesMissed: value.timesMissed || 0,
  }
}

function normalizeProgress(raw) {
  const next = { [META_KEY]: { ...defaultMeta(), ...(raw?.[META_KEY] || {}) } }

  Object.entries(raw || {}).forEach(([termId, value]) => {
    if (termId === META_KEY) return
    const record = migrateTermRecord(value)
    if (record && record.status !== 'unmarked') {
      next[termId] = record
    }
  })

  return next
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return normalizeProgress(raw ? JSON.parse(raw) : {})
  } catch {
    return normalizeProgress({})
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

function touchStudyMeta(meta) {
  const today = todayKey()
  let currentStreak = meta.currentStreak || 0

  if (meta.lastStudiedDate !== today) {
    const gap = meta.lastStudiedDate ? daysBetween(meta.lastStudiedDate, today) : null
    currentStreak = gap === 1 ? currentStreak + 1 : 1
  }

  return {
    ...meta,
    lastStudiedDate: today,
    currentStreak,
    bestStreak: Math.max(meta.bestStreak || 0, currentStreak),
    totalSessions: (meta.totalSessions || 0) + 1,
  }
}

function nextInterval(record, status, result) {
  if (status === 'learning' || result === 'missed') return 1
  const correct = record.timesCorrect || 0
  if (correct <= 1) return 3
  if (correct === 2) return 7
  if (correct === 3) return 14
  return 30
}

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress)

  const markTerm = useCallback((termId, status, result = null) => {
    setProgress(prev => {
      const next = { ...prev, [META_KEY]: touchStudyMeta(prev[META_KEY] || defaultMeta()) }

      if (!status) {
        delete next[termId]
        saveProgress(next)
        return next
      }

      const existing = migrateTermRecord(prev[termId]) || {
        status,
        lastReviewed: null,
        nextReviewDate: todayKey(),
        timesCorrect: 0,
        timesMissed: 0,
      }

      const record = {
        ...existing,
        status,
        lastReviewed: todayKey(),
        timesCorrect: existing.timesCorrect + (status === 'known' || result === 'correct' ? 1 : 0),
        timesMissed: existing.timesMissed + (status === 'learning' || result === 'missed' ? 1 : 0),
      }

      record.nextReviewDate = addDays(nextInterval(record, status, result))
      next[termId] = record
      next[META_KEY].totalReviews = (next[META_KEY].totalReviews || 0) + 1

      saveProgress(next)
      return next
    })
  }, [])

  const recordReview = useCallback((termId, isCorrect) => {
    markTerm(termId, isCorrect ? 'known' : 'learning', isCorrect ? 'correct' : 'missed')
  }, [markTerm])

  const recordQuiz = useCallback(({ unitId, score, total, missedIds = [] }) => {
    setProgress(prev => {
      const meta = touchStudyMeta(prev[META_KEY] || defaultMeta())
      const quiz = {
        unitId,
        score,
        total,
        pct: total > 0 ? Math.round((score / total) * 100) : 0,
        missedIds,
        date: todayKey(),
      }
      const next = {
        ...prev,
        [META_KEY]: {
          ...meta,
          quizzesTaken: (meta.quizzesTaken || 0) + 1,
          perfectQuizzes: (meta.perfectQuizzes || 0) + (score === total ? 1 : 0),
          recentQuizzes: [quiz, ...(meta.recentQuizzes || [])].slice(0, 8),
        },
      }

      saveProgress(next)
      return next
    })
  }, [])

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setProgress(normalizeProgress({}))
  }, [])

  return { progress, markTerm, recordReview, recordQuiz, resetAll }
}
