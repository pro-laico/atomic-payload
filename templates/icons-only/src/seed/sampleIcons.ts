import fs from 'node:fs'
import path from 'node:path'

/**
 * Sample icons used by the `/api/seed` endpoint to demonstrate
 * `@pro-laico/icons`. Reads every `.svg` in `src/seed/icons/` at request
 * time — that folder is gitignored, so drop your own SVGs in to seed them.
 */
export type SampleIcon = { filename: string; svg: string }

const iconsDir = path.join(process.cwd(), 'src', 'seed', 'icons')

function loadSampleIcons(): SampleIcon[] {
  if (!fs.existsSync(iconsDir)) return []
  return fs
    .readdirSync(iconsDir)
    .filter((f) => f.toLowerCase().endsWith('.svg'))
    .sort()
    .map((filename) => ({ filename, svg: fs.readFileSync(path.join(iconsDir, filename), 'utf8') }))
}

export const sampleIcons: SampleIcon[] = loadSampleIcons()

/** The icons get bundled into an example IconSet, exposing the IconSet collection too. */
export const sampleIconSetTitle = 'Demo Icon Set'
export const sampleIconSetEntries: { name: string; filename: string }[] = sampleIcons.map((i) => ({
  name: i.filename.replace(/\.svg$/, ''),
  filename: i.filename,
}))
