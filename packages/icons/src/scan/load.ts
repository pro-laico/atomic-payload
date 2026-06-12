/**
 * Manifest path resolution + reading — the ONLY part of the scan feature the
 * admin "requested icons" panel needs at runtime. Kept deliberately separate
 * from {@link file://./index.ts} (the build/CLI aggregator) so the admin server
 * component can import it without dragging in the parser/CLI chain.
 *
 * Why that matters: `index.ts` and `extract.ts` are consumed by the raw-Node
 * CLI (`dist/scan/cli.js`), which requires explicit `.js` import specifiers —
 * but a bundler (Next/webpack) resolving the admin component can't map a `.js`
 * specifier back to a `.ts` source, so importing the index chain from the
 * component breaks `next build`. This module sidesteps that entirely: its only
 * relative import is type-only (erased at compile time), so it has NO runtime
 * relative imports and resolves cleanly under both a bundler and raw Node.
 */

import { readFileSync } from 'node:fs'
import { isAbsolute, resolve } from 'node:path'

import type { IconUsageManifest } from './types'

/** Default manifest filename, resolved relative to the scan's working directory. */
export const DEFAULT_MANIFEST_FILENAME = 'icon-usage-manifest.json'

/** Env var the admin panel and scanner both honor to override the manifest path. */
export const MANIFEST_PATH_ENV = 'ICON_USAGE_MANIFEST'

/** Resolves the manifest path: explicit arg → `ICON_USAGE_MANIFEST` env → default filename under `cwd`. */
export const resolveManifestPath = (explicit?: string, cwd: string = process.cwd()): string => {
  const chosen = explicit ?? process.env[MANIFEST_PATH_ENV] ?? DEFAULT_MANIFEST_FILENAME
  return isAbsolute(chosen) ? chosen : resolve(cwd, chosen)
}

/**
 * Reads and parses a manifest from disk. Returns `null` when the file is
 * absent or unparseable, so callers (the admin panel) can render a graceful
 * "run the scan" empty state rather than throwing.
 */
export const loadIconUsageManifest = (path?: string, cwd?: string): IconUsageManifest | null => {
  const abs = resolveManifestPath(path, cwd)
  try {
    const parsed = JSON.parse(readFileSync(abs, 'utf8')) as IconUsageManifest
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.names)) return null
    return parsed
  } catch {
    return null
  }
}
