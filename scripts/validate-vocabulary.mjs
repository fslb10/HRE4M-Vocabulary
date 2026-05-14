import units from '../src/data/vocabulary.js'
import { validateVocabulary } from '../src/utils/study.js'

const errors = validateVocabulary(units)

if (errors.length > 0) {
  console.error('Vocabulary validation failed:')
  errors.forEach(error => console.error(`- ${error}`))
  process.exit(1)
}

console.log(`Vocabulary validation passed for ${units.length} units.`)
