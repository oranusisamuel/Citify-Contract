const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const duplicateAppPath = path.join(rootDir, 'citify-contractors')

if (fs.existsSync(duplicateAppPath)) {
  console.warn('Legacy nested app folder detected at ./citify-contractors. Source of truth is ./src; nested app is retained intentionally and should not be used for new work.')
  process.exit(0)
}

console.log('Single-source structure check passed.')
