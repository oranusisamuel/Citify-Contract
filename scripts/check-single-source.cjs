const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const duplicateAppPath = path.join(rootDir, 'citify-contractors')
const strictMode = process.argv.includes('--strict') || process.env.CHECK_SINGLE_SOURCE_STRICT === 'true'

if (fs.existsSync(duplicateAppPath)) {
  const message = 'Legacy nested app folder detected at ./citify-contractors. Source of truth is ./src; nested app should not be used for new work.'

  if (strictMode) {
    console.error(`${message} Strict mode is enabled, so this check is failing.`)
    process.exit(1)
  }

  console.warn(`${message} Run with --strict (or CHECK_SINGLE_SOURCE_STRICT=true) to enforce failure.`)
  process.exit(0)
}

console.log('Single-source structure check passed.')
