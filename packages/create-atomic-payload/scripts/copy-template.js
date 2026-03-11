#!/usr/bin/env node
/**
 * Copies the template into the package for npm publish.
 * Run before `pnpm pack` or `npm publish`.
 */
import { cpSync, mkdirSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templateSource = path.join(__dirname, '..', '..', '..', 'templates', 'atomic-payload')
const templateDest = path.join(__dirname, '..', 'template')

if (!existsSync(templateSource)) {
  console.error('Template not found at:', templateSource)
  process.exit(1)
}

mkdirSync(templateDest, { recursive: true })
cpSync(templateSource, templateDest, {
  recursive: true,
  filter: (src) => {
    const name = path.basename(src)
    return !['node_modules', '.next', '.git', '.env'].includes(name) && !name.endsWith('.tsbuildinfo')
  },
})
console.log('Template copied to package/template')
