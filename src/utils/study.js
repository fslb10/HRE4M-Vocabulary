export function getTermStatus(progress, termId) {
  return progress[termId] || 'unmarked'
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

export function getUnitStats(unit, progress) {
  const total = unit.terms.length
  const known = unit.terms.filter(term => progress[term.id] === 'known').length
  const learning = unit.terms.filter(term => progress[term.id] === 'learning').length
  const unmarked = total - known - learning
  const pct = total > 0 ? Math.round((known / total) * 100) : 0

  return { total, known, learning, unmarked, pct }
}

export function getCourseStats(units, progress) {
  const allTerms = units.flatMap(unit => unit.terms)
  const total = allTerms.length
  const known = allTerms.filter(term => progress[term.id] === 'known').length
  const learning = allTerms.filter(term => progress[term.id] === 'learning').length
  const unmarked = total - known - learning
  const pct = total > 0 ? Math.round((known / total) * 100) : 0

  return { total, known, learning, unmarked, pct }
}

export function getStudyQueue(units, progress) {
  const allTerms = units.flatMap(unit =>
    unit.terms.map(term => ({
      ...term,
      unitId: unit.id,
      unitTitle: unit.title,
      accentColor: unit.accentColor,
    }))
  )

  return [
    ...allTerms.filter(term => progress[term.id] === 'learning'),
    ...allTerms.filter(term => !progress[term.id]),
  ]
}
