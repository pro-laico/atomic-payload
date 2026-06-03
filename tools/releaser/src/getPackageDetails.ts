import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

/** Workspace groups whose packages share the monorepo version. `tools/*` is
 *  intentionally excluded — internal tooling is not part of the released set. */
const RELEASE_GROUPS = ['packages', 'templates', 'examples'] as const

export interface PackageDetails {
  /** `name` field from package.json. */
  name: string
  /** Current `version` field. */
  version: string
  /** True when the package is not published (templates, etc.). */
  private: boolean
  /** Absolute path to the package.json. */
  pkgJsonPath: string
}

/** Walk up from `start` until a directory containing `pnpm-workspace.yaml` is
 *  found. Throws if none is found (run this from inside the monorepo). */
export function findRepoRoot(start: string = process.cwd()): string {
  let dir = start
  while (true) {
    if (existsSync(join(dir, 'pnpm-workspace.yaml'))) return dir
    const parent = dirname(dir)
    if (parent === dir) throw new Error('[releaser] Could not locate the monorepo root (no pnpm-workspace.yaml found above the cwd).')
    dir = parent
  }
}

export const REPO_ROOT = findRepoRoot()
export const ROOT_PACKAGE_JSON = join(REPO_ROOT, 'package.json')

/** Read every releasable workspace package (packages/* + templates/*), sorted by name. */
export function getReleasablePackages(): PackageDetails[] {
  const out: PackageDetails[] = []
  for (const group of RELEASE_GROUPS) {
    const groupDir = join(REPO_ROOT, group)
    if (!existsSync(groupDir)) continue
    for (const entry of readdirSync(groupDir)) {
      const pkgJsonPath = join(groupDir, entry, 'package.json')
      if (!existsSync(pkgJsonPath)) continue
      const json = JSON.parse(readFileSync(pkgJsonPath, 'utf8')) as { name?: string; version?: string; private?: boolean }
      if (!json.name || !json.version) continue
      out.push({ name: json.name, version: json.version, private: Boolean(json.private), pkgJsonPath })
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name))
}
