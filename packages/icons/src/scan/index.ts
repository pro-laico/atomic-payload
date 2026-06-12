/**
 * Build-time icon-usage scan — the Node-side entry point. Walks a project's
 * source tree, extracts every literal `<Icon name="…">` (see {@link extractIconUsages}),
 * and aggregates the result into an {@link IconUsageManifest} that the admin
 * "requested icons" panel reads.
 *
 * Zero third-party dependencies: directory walking uses `node:fs` directly so
 * the package adds nothing to a consumer's install for this feature.
 */

import { type Dirent, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'

import { extractIconUsages } from './extract.js'
import type { IconUsage, IconUsageManifest } from './types.js'

export { extractIconUsages } from './extract.js'
export type { ExtractedUsage, ExtractOptions } from './extract.js'
export type { IconUsage, IconUsageManifest } from './types.js'
// Manifest path resolution + reading live in ./load (a bundler-safe leaf with no
// runtime relative imports) so the admin panel can import them without pulling
// in this CLI/parser module. Re-exported here to keep the `./scan` API in one place.
export { DEFAULT_MANIFEST_FILENAME, loadIconUsageManifest, MANIFEST_PATH_ENV, resolveManifestPath } from './load.js'

/** File extensions scanned by default — the JSX-bearing source formats. */
export const DEFAULT_EXTENSIONS = ['tsx', 'jsx', 'ts', 'js', 'mdx']

/** Directory names never descended into. */
export const DEFAULT_IGNORE = ['node_modules', '.next', '.git', 'dist', 'build', 'coverage', '.turbo']

export interface ScanOptions {
  /**
   * Directories (or individual files) to scan, relative to {@link cwd} or
   * absolute. Each directory is walked recursively.
   *
   * @default ['src', 'app']
   */
  roots?: string[]
  /**
   * Working directory the scan resolves {@link roots} and reports file paths
   * relative to.
   *
   * @default process.cwd()
   */
  cwd?: string
  /**
   * JSX tag names treated as icon usages. Forwarded to {@link extractIconUsages}.
   *
   * @default ['Icon']
   */
  components?: string[]
  /**
   * File extensions (without the dot) to read.
   *
   * @default ['tsx', 'jsx', 'ts', 'js', 'mdx']
   */
  extensions?: string[]
  /**
   * Directory names to skip while walking.
   *
   * @default ['node_modules', '.next', '.git', 'dist', 'build', 'coverage', '.turbo']
   */
  ignore?: string[]
}

const toPosix = (p: string): string => p.split(sep).join('/')

/** Recursively collects scannable file paths under `dir`. */
const walk = (dir: string, exts: Set<string>, ignore: Set<string>, out: string[]): void => {
  let entries: Dirent[]
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return // unreadable/non-existent root — skip silently, the caller reports totals
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!ignore.has(entry.name)) walk(full, exts, ignore, out)
    } else if (entry.isFile()) {
      const dot = entry.name.lastIndexOf('.')
      if (dot !== -1 && exts.has(entry.name.slice(dot + 1))) out.push(full)
    }
  }
}

/** The result of a {@link scanIconUsages} run. */
export interface ScanResult {
  /** The assembled manifest, ready to write. */
  manifest: IconUsageManifest
  /** Number of files read during the scan. */
  filesScanned: number
}

/**
 * Scans the project for literal icon usages and builds a manifest. Pure with
 * respect to output (writes nothing) — use {@link writeIconUsageManifest} to
 * persist the result.
 *
 * @example
 * ```ts
 * const { manifest } = scanIconUsages({ roots: ['src', 'app'] })
 * console.log(manifest.names) // ['arrow-right', 'chevron', 'x', …]
 * ```
 */
export const scanIconUsages = (options: ScanOptions = {}): ScanResult => {
  const cwd = options.cwd ?? process.cwd()
  const roots = options.roots?.length ? options.roots : ['src', 'app']
  const exts = new Set((options.extensions?.length ? options.extensions : DEFAULT_EXTENSIONS).map((e) => e.replace(/^\./, '')))
  const ignore = new Set(options.ignore?.length ? options.ignore : DEFAULT_IGNORE)

  const files: string[] = []
  for (const root of roots) {
    const abs = isAbsolute(root) ? root : resolve(cwd, root)
    let stat: ReturnType<typeof statSync> | null = null
    try {
      stat = statSync(abs)
    } catch {
      continue // missing root — skip
    }
    if (stat.isDirectory()) walk(abs, exts, ignore, files)
    else if (stat.isFile()) files.push(abs)
  }

  const usages: IconUsage[] = []
  let filesScanned = 0
  for (const file of files) {
    let source: string
    try {
      source = readFileSync(file, 'utf8')
    } catch {
      continue
    }
    filesScanned++
    const rel = toPosix(relative(cwd, file))
    for (const u of extractIconUsages(source, { components: options.components })) {
      usages.push({ name: u.name, file: rel, line: u.line, column: u.column })
    }
  }

  // Deterministic ordering so the manifest is diff-stable across runs.
  usages.sort((a, b) => a.name.localeCompare(b.name) || a.file.localeCompare(b.file) || a.line - b.line || a.column - b.column)
  const names = [...new Set(usages.map((u) => u.name))].sort((a, b) => a.localeCompare(b))

  return {
    manifest: { version: 1, generatedAt: new Date().toISOString(), names, usages },
    filesScanned,
  }
}

/**
 * Writes a manifest to disk as pretty-printed JSON (trailing newline). Returns
 * the absolute path written.
 */
export const writeIconUsageManifest = (manifest: IconUsageManifest, path: string): string => {
  const abs = isAbsolute(path) ? path : resolve(process.cwd(), path)
  writeFileSync(abs, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  return abs
}
