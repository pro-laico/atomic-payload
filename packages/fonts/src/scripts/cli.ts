#!/usr/bin/env node
import { runDownloadFonts } from './downloadFonts.js'

runDownloadFonts().catch((err) => {
  console.error(err)
  process.exit(1)
})
