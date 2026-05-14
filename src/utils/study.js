const META_KEY = '__meta'

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

export function getProgressMeta(progress) {
  return progress?.[META_KEY] || {
    currentStreak: 0,
    bestStreak: 0,
    totalSessions: 0,
    totalReviews: 0,
    quizzesTaken: 0,
    perfectQuizzes: 0,
    recentQuizzes: [],
  }
}

export function getTermRecord(progress, termId) {
  const value = progress?.[termId]
  if (!value) return null
  if (typeof value === 'string') {
    return {
      status: value,
      lastReviewed: null,
      nextReviewDate: value === 'known' ? todayKey() : todayKey(),
      timesCorrect: value === 'known' ? 1 : 0,
      timesMissed: value === 'learning' ? 1 : 0,
    }
  }
  return value
}

export function getTermStatus(progress, termId) {
  return getTermRecord(progress, termId)?.status || 'unmarked'
}

export function isTermDue(progress, termId) {
  const record = getTermRecord(progress, termId)
  if (!record) return true
  if (record.status === 'learning') return true
  return Boolean(record.nextReviewDate && record.nextReviewDate <= todayKey())
}

export function dueLabel(progress, termId) {
  const record = getTermRecord(progress, termId)
  if (!record) return 'New'
  if (record.status === 'learning') return 'Due now'
  if (!record.nextReviewDate) return 'Due now'
  if (record.nextReviewDate <= todayKey()) return 'Due now'
  return `Due ${record.nextReviewDate}`
}

export function getUnitSections(unit) {
  if (unit.sections?.length) return unit.sections

  return [...new Set(unit.terms.map(term => term.unitSubsection))]
    .filter(Boolean)
    .map(id => ({
      id,
      title: `Section ${id}`,
      summary: `${unit.title} vocabulary from section ${id}.`,
    }))
}

export function getAllTerms(units) {
  return units.flatMap(unit =>
    unit.terms.map(term => ({
      ...term,
      unitId: unit.id,
      unitTitle: unit.title,
      accentColor: unit.accentColor,
      sectionTitle: getUnitSections(unit).find(section => section.id === term.unitSubsection)?.title,
    }))
  )
}

export function getSectionStats(unit, progress) {
  return getUnitSections(unit).map(section => {
    const terms = unit.terms.filter(term => term.unitSubsection === section.id)
    return {
      ...section,
      ...getStatsForTerms(terms, progress),
      terms,
    }
  })
}

function getStatsForTerms(terms, progress) {
  const total = terms.length
  const known = terms.filter(term => getTermStatus(progress, term.id) === 'known').length
  const learning = terms.filter(term => getTermStatus(progress, term.id) === 'learning').length
  const due = terms.filter(term => isTermDue(progress, term.id)).length
  const unmarked = total - known - learning
  const pct = total > 0 ? Math.round((known / total) * 100) : 0

  return { total, known, learning, unmarked, due, pct }
}

export function getUnitStats(unit, progress) {
  return getStatsForTerms(unit.terms, progress)
}

export function getCourseStats(units, progress) {
  return getStatsForTerms(getAllTerms(units), progress)
}

export function getDueTerms(units, progress, limit = null) {
  const due = getAllTerms(units).filter(term => isTermDue(progress, term.id))
  return limit ? due.slice(0, limit) : due
}

export function getStudyQueue(units, progress) {
  const allTerms = getAllTerms(units)
  const due = allTerms.filter(term => isTermDue(progress, term.id))
  const learning = allTerms.filter(term => getTermStatus(progress, term.id) === 'learning' && !due.includes(term))
  const newTerms = allTerms.filter(term => getTermStatus(progress, term.id) === 'unmarked' && !due.includes(term))

  return [...due, ...learning, ...newTerms]
}

export function getAchievements(units, progress) {
  const stats = getCourseStats(units, progress)
  const meta = getProgressMeta(progress)
  const unitStats = units.map(unit => ({ unit, stats: getUnitStats(unit, progress) }))

  return [
    {
      id: 'first-review',
      title: 'First Review',
      description: 'Mark your first term as learning or known.',
      earned: meta.totalReviews > 0,
    },
    {
      id: 'daily-streak',
      title: 'Three-Day Streak',
      description: 'Study for three days in a row.',
      earned: meta.currentStreak >= 3,
    },
    {
      id: 'unit-mastered',
      title: 'Unit Mastered',
      description: 'Mark every term in any unit as known.',
      earned: unitStats.some(item => item.stats.total > 0 && item.stats.pct === 100),
    },
    {
      id: 'perfect-quiz',
      title: 'Perfect Quiz',
      description: 'Score 100% on a quiz.',
      earned: meta.perfectQuizzes > 0,
    },
    {
      id: 'half-course',
      title: 'Halfway There',
      description: 'Know at least half of all vocabulary terms.',
      earned: stats.pct >= 50,
    },
  ]
}

export function validateVocabulary(units) {
  const errors = []
  const ids = new Set()

  units.forEach(unit => {
    if (!unit.title) errors.push(`Unit ${unit.id} is missing a title.`)
    if (!Array.isArray(unit.terms)) errors.push(`${unit.title} is missing terms.`)

    const sectionIds = new Set(getUnitSections(unit).map(section => section.id))
    unit.terms.forEach(term => {
      if (ids.has(term.id)) errors.push(`Duplicate term id: ${term.id}`)
      ids.add(term.id)
      if (!term.term || !term.definition || !term.example) {
        errors.push(`${term.id} is missing term, definition, or example.`)
      }
      if (term.unitSubsection && unit.sections?.length && !sectionIds.has(term.unitSubsection)) {
        errors.push(`${term.id} uses unknown section ${term.unitSubsection}.`)
      }
    })
  })

  return errors
}
