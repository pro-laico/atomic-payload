/**
 * Manifest for the bundled sample fonts. The seed route fetches each `file`
 * from `public/seed-fonts/` and uploads it to the `font` collection with the
 * given `title` + `family`. One open-source (OFL) Google font per family.
 *
 * See `public/seed-fonts/LICENSES.md` for sources + licenses.
 */
export type SampleFont = {
  file: string
  title: string
  family: 'sans' | 'serif' | 'mono' | 'display'
}

export const sampleFonts: SampleFont[] = [
  { file: 'inter.woff2', title: 'Inter', family: 'sans' },
  { file: 'lora.woff2', title: 'Lora', family: 'serif' },
  { file: 'jetbrains-mono.woff2', title: 'JetBrains Mono', family: 'mono' },
  { file: 'abril-fatface.woff2', title: 'Abril Fatface', family: 'display' },
]
