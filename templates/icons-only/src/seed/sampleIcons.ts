import fs from 'node:fs'
import path from 'node:path'

/**
 * Sample icon sets used by the `/api/seed` endpoint to demonstrate
 * `@pro-laico/icons`. Each entry reads every `.svg` from its on-disk folder
 * at request time — drop new SVGs in or rename folders to customize.
 *
 * Filenames in each folder are mirrored across sets (e.g. `check.svg` exists
 * in both `icons/` and `icons-two/`) so the **lookup name** stays identical:
 * a consumer calling `getCached('icon', 'check', …)` keeps working no matter
 * which set is active. The seed prefixes the *upload* filename with the set
 * key so the Payload icon docs themselves stay distinct.
 */
export type SampleIcon = {
  /** Lookup name written into `iconSet.iconsArray[].name`. Shared across sets. */
  name: string
  /** Filename used when uploading to the `icon` collection. Set-prefixed to stay unique. */
  filename: string
  svg: string
}

export type SampleIconSet = {
  /** Stable key used by the seed route (`/api/seed?set=<key>`). */
  key: string
  /** Title used for the Payload IconSet document. */
  title: string
  /** Folder name under `src/seed/` to read SVGs from. */
  dir: string
  /** Whether this set should be marked `active: true` when first seeded. */
  defaultActive: boolean
  icons: SampleIcon[]
  entries: { name: string; filename: string }[]
}

const seedRoot = path.join(process.cwd(), 'src', 'seed')

function loadIconSet(key: string, title: string, dir: string, defaultActive: boolean): SampleIconSet {
  const folder = path.join(seedRoot, dir)
  const files = fs.existsSync(folder) ? fs.readdirSync(folder).filter((f) => f.toLowerCase().endsWith('.svg')).sort() : []
  const icons: SampleIcon[] = files.map((file) => ({
    name: file.replace(/\.svg$/, ''),
    filename: `${key}-${file}`,
    svg: fs.readFileSync(path.join(folder, file), 'utf8'),
  }))
  return {
    key,
    title,
    dir,
    defaultActive,
    icons,
    entries: icons.map((i) => ({ name: i.name, filename: i.filename })),
  }
}

export const sampleIconSets: SampleIconSet[] = [
  loadIconSet('one', 'Demo Icon Set', 'icons', true),
  loadIconSet('two', 'Second Demo Set', 'icons-two', false),
]

export const findSampleIconSet = (key: string): SampleIconSet | undefined =>
  sampleIconSets.find((s) => s.key === key)
