#!/usr/bin/env node
import { runDownloadFonts } from './downloadFonts.js'

// `--verbose` / `-v` prints the full underlying error on failure; without it,
// failures show only the short message (the usual local case).
const verbose = process.argv.slice(2).some((arg) => arg === '--verbose' || arg === '-v')

runDownloadFonts({ verbose }).catch((err) => {
  console.error(err)
  process.exit(1)
})
