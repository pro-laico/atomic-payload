import fs from 'node:fs'
import path from 'node:path'

import dotenv from 'dotenv'

const colors = {
  blue: (t: string) => `\x1b[34m${t}\x1b[0m`,
  green: (t: string) => `\x1b[32m${t}\x1b[0m`,
  red: (t: string) => `\x1b[31m${t}\x1b[0m`,
  orange: (t: string) => `\x1b[33m${t}\x1b[0m`,
}

type GenericFontFamily = 'sans' | 'serif' | 'mono' | 'display'
const ROLES: GenericFontFamily[] = ['sans', 'serif', 'mono', 'display']

/** One font file as returned by the plugin's `/api/fonts/export` endpoint. */
type ExportedFont = { filename: string; extension: string; mimeType: string | null; data: string; weight?: string | null; style?: string | null }
// A role carries an array of weight files (current) or a single file (pre-0.4 data); both tolerated.
type ExportFontsResponse = { fonts: Partial<Record<GenericFontFamily, ExportedFont[] | ExportedFont>> }

/** A written weight file, ready to emit into a generated `localFont` `src` array. */
type WeightFile = { path: string; weight: string; style: string }

export type RunDownloadFontsOptions = {
  /** Directory for downloaded font files. Default `./public/fonts` or `ATOMIC_FONTS_OUTPUT_DIR`. */
  fontsOutputDir?: string
  /** Generated `next/font/local` module path. Default `./src/app/definition.ts` or `ATOMIC_FONTS_DEFINITION_FILE`. */
  definitionFile?: string
  /** Dotenv file to load before reading env. Default `./.env` or `ATOMIC_FONTS_ENV_FILE`. */
  envFile?: string
  /**
   * `src` path passed to `localFont()` in the generated file (relative to the definition file’s directory).
   * Default `../../public/fonts` or `ATOMIC_FONTS_SRC_PREFIX`. If you change `fontsOutputDir`, set this accordingly.
   */
  localFontSrcPrefix?: string
  /**
   * Prefix for the CSS custom properties emitted by the generated `localFont()`
   * calls. The slot name is appended capitalised (e.g. `--font-setSans`).
   * Default `--font-set` or `ATOMIC_FONTS_CSS_VAR_PREFIX`. Change it only if your
   * stylesheet references different variable names.
   */
  cssVariablePrefix?: string
  /** Base URL of the running Payload instance to fetch from. Default `FONT_DOWNLOAD_URL`. */
  siteUrl?: string
  /**
   * Path of the plugin's fonts export endpoint, resolved against the site URL.
   * Default `/api/fonts/export` or `ATOMIC_FONTS_ENDPOINT`.
   */
  endpointPath?: string
  /**
   * When true, failures also print the full underlying error object (stack,
   * cause, …). Defaults to false (or `ATOMIC_FONTS_VERBOSE`), so a routine local
   * failure shows only the short message. Enable with the `--verbose` / `-v` CLI
   * flag or `ATOMIC_FONTS_VERBOSE=true` when you need to debug the error itself.
   */
  verbose?: boolean
}

function resolveOptions(overrides?: RunDownloadFontsOptions) {
  return {
    fontsOutputDir: overrides?.fontsOutputDir ?? process.env.ATOMIC_FONTS_OUTPUT_DIR ?? './public/fonts',
    definitionFile: overrides?.definitionFile ?? process.env.ATOMIC_FONTS_DEFINITION_FILE ?? './src/app/definition.ts',
    envFile: overrides?.envFile ?? process.env.ATOMIC_FONTS_ENV_FILE ?? './.env',
    localFontSrcPrefix: overrides?.localFontSrcPrefix ?? process.env.ATOMIC_FONTS_SRC_PREFIX ?? '../../public/fonts',
    cssVariablePrefix: overrides?.cssVariablePrefix ?? process.env.ATOMIC_FONTS_CSS_VAR_PREFIX ?? '--font-set',
    endpointPath: overrides?.endpointPath ?? process.env.ATOMIC_FONTS_ENDPOINT ?? '/api/fonts/export',
    verbose: overrides?.verbose ?? process.env.ATOMIC_FONTS_VERBOSE === 'true',
  }
}

export async function runDownloadFonts(overrides?: RunDownloadFontsOptions): Promise<void> {
  const opts = resolveOptions(overrides)
  dotenv.config({ path: opts.envFile })

  const FONT_FILES_DIR = opts.fontsOutputDir
  const FONT_DEFINITION_FILE = opts.definitionFile
  const localPrefix = opts.localFontSrcPrefix.replace(/\/$/, '')

  function generateFontDefinitions(roleFiles: Record<GenericFontFamily, WeightFile[]>): void {
    const cssVar = (type: GenericFontFamily) => `${opts.cssVariablePrefix}${type.charAt(0).toUpperCase()}${type.slice(1)}`
    const configs: Array<{ name: string; type: GenericFontFamily; variable: string }> = [
      { name: 'fontSans', type: 'sans', variable: cssVar('sans') },
      { name: 'fontSerif', type: 'serif', variable: cssVar('serif') },
      { name: 'fontMono', type: 'mono', variable: cssVar('mono') },
      { name: 'fontDisplay', type: 'display', variable: cssVar('display') },
    ]

    // One `localFont()` per role, each with an array of weighted `src` entries —
    // so multiple weights collapse into a single CSS variable for that role.
    const available = configs.filter((c) => roleFiles[c.type].length > 0)
    const declarations = available
      .map((c) => {
        const src = roleFiles[c.type].map((f) => `{ path: '${f.path}', weight: '${f.weight}', style: '${f.style}' }`).join(', ')
        return `const ${c.name} = localFont({ src: [${src}], variable: '${c.variable}' })`
      })
      .join('\n')
    const exports = available.map((c) => c.name).join(', ')

    fs.mkdirSync(path.dirname(FONT_DEFINITION_FILE), { recursive: true })

    fs.writeFileSync(
      FONT_DEFINITION_FILE,
      `// DO NOT EDIT MANUALLY. THIS FILE IS AUTOMATICALLY GENERATED.
${declarations.length === 0 ? '//eslint-disable-next-line' : ''}
import localFont from 'next/font/local'

${declarations || '// No fonts available'}

const fonts = { ${exports} }
export default fonts
`,
    )
  }

  /**
   * On a skip/fail, guarantee the generated module exists so a clean build —
   * where `definition.ts` is gitignored and therefore absent (e.g. a fresh
   * Vercel checkout) — doesn't die with "Can't resolve '@/app/definition'". An
   * existing definition is left untouched (it may hold previously downloaded
   * fonts); only the absent case writes the empty-but-valid stub.
   */
  function ensureDefinitionFile(): void {
    if (fs.existsSync(FONT_DEFINITION_FILE)) return
    generateFontDefinitions({ sans: [], serif: [], mono: [], display: [] })
    console.warn(colors.orange(`No ${FONT_DEFINITION_FILE} found — wrote an empty stub so the build can proceed.`))
  }

  function wipeFontFiles(): void {
    if (!fs.existsSync(FONT_FILES_DIR)) fs.mkdirSync(FONT_FILES_DIR, { recursive: true })
    // Only unlink files — a stray subdirectory would make unlinkSync throw EISDIR.
    for (const file of fs.readdirSync(FONT_FILES_DIR)) {
      const filePath = path.join(FONT_FILES_DIR, file)
      if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath)
    }
  }

  function warnAndKeep(message: string, error?: unknown): void {
    console.warn(colors.red(message))
    if (error) {
      if (opts.verbose) console.warn(error)
      else console.warn(colors.orange('Re-run with --verbose (or set ATOMIC_FONTS_VERBOSE=true) to see the full error.'))
    }
    console.warn(colors.orange('Font download failed — existing fonts left untouched'))
  }

  console.log(colors.blue('Starting Font Download...\n'))

  const siteUrl = overrides?.siteUrl ?? process.env.FONT_DOWNLOAD_URL
  const secret = process.env.PAYLOAD_SECRET
  // Validate config BEFORE touching disk so a missing var preserves any
  // previously downloaded fonts + definition instead of leaving the build font-less.
  if (!siteUrl || !secret) {
    if (!siteUrl) console.warn(colors.red('Missing required environment variable: FONT_DOWNLOAD_URL'))
    if (!secret) console.warn(colors.red('Missing required environment variable: PAYLOAD_SECRET'))
    console.warn(colors.orange('Font download skipped — existing fonts left untouched'))
    ensureDefinitionFile()
    return
  }

  // Fetch the active fonts from the plugin's export endpoint, authenticating
  // with the project's PAYLOAD_SECRET. Done BEFORE wiping disk so a failed
  // request leaves any previously downloaded fonts in place.
  const endpoint = new URL(opts.endpointPath, siteUrl).toString()
  let manifest: ExportFontsResponse
  try {
    const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${secret}` } })
    if (!res.ok) {
      warnAndKeep(`Font export endpoint returned HTTP ${res.status} ${res.statusText}`)
      ensureDefinitionFile()
      return
    }
    manifest = (await res.json()) as ExportFontsResponse
  } catch (err) {
    warnAndKeep(`Could not reach the font export endpoint at ${endpoint}`, err)
    ensureDefinitionFile()
    return
  }

  const fonts = manifest?.fonts ?? {}

  wipeFontFiles()

  const roleFiles: Record<GenericFontFamily, WeightFile[]> = { sans: [], serif: [], mono: [], display: [] }
  let count = 0
  for (const role of ROLES) {
    const value = fonts[role]
    if (!value) continue
    // Tolerate the pre-0.4 single-object shape by wrapping it in an array.
    const files = Array.isArray(value) ? value : [value]
    for (let i = 0; i < files.length; i++) {
      const font = files[i]
      if (!font?.data) continue
      try {
        const ext = font.extension || font.filename.split('.').pop()?.toLowerCase() || 'woff2'
        const weight = font.weight || '400'
        const style = font.style || 'normal'
        // Distinct filename per weight/style; append the index if two files share one.
        const base = `${role}-${weight}${style === 'italic' ? '-italic' : ''}`
        const fileName = roleFiles[role].some((f) => f.path.endsWith(`/${base}.${ext}`)) ? `${base}-${i}` : base
        fs.writeFileSync(path.join(FONT_FILES_DIR, `${fileName}.${ext}`), Buffer.from(font.data, 'base64'))
        roleFiles[role].push({ path: `${localPrefix}/${fileName}.${ext}`, weight, style })
        count++
      } catch (err) {
        console.warn(colors.red(`Failed to write ${role} font (weight ${font.weight ?? '?'})`))
        if (opts.verbose) console.warn(err)
      }
    }
    const written = roleFiles[role].length
    if (written) console.log(`${colors.green('✓')} Downloaded ${role} font (${written} weight${written === 1 ? '' : 's'})`)
  }

  generateFontDefinitions(roleFiles)

  if (count === 0) console.log(colors.orange('\nNo active fonts returned — generated an empty definition.\n'))
  else console.log(colors.green(`\n✓ Font definitions generated (${count} font file${count === 1 ? '' : 's'})\n`))
}
