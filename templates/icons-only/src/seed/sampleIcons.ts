import fs from 'node:fs'
import path from 'node:path'

/**
 * Sample icons used by the `/api/seed` endpoint to demonstrate
 * `@pro-laico/icons`. SVG content is read from `src/seed/icons/*.svg` so the
 * on-disk files are the source of truth — drop new SVGs in that folder and
 * add their filenames below to extend the demo.
 */
export type SampleIcon = { filename: string; svg: string }

const iconsDir = path.join(process.cwd(), 'src', 'seed', 'icons')

const iconFilenames = ['check.svg', 'x.svg', 'heart.svg', 'star.svg', 'arrow-right.svg', 'cog.svg']

export const sampleIcons: SampleIcon[] = iconFilenames.map((filename) => ({
  filename,
  svg: fs.readFileSync(path.join(iconsDir, filename), 'utf8'),
}))

/** The icons get bundled into an example IconSet, exposing the IconSet collection too. */
export const sampleIconSetTitle = 'Demo Icon Set'
export const sampleIconSetEntries: { name: string; filename: string }[] = sampleIcons.map((i) => ({
  name: i.filename.replace(/\.svg$/, ''),
  filename: i.filename,
}))
