const path = require('node:path')

const buildESLintCommand = (filenames) => 
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

module.exports = {
  '*.{ts,tsx}': () => "tsc --noEmit --incremental false",
  '*.{ts,tsx,js,jsx}': [buildESLintCommand],
  '*.{js,jsx,ts,tsx}': ['jest --passWithNoTests'],
}
