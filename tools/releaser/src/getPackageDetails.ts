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
  /** True when the package is not published (templates, examples, etc.). */
  private: boolean
  /** Absolute path to the package directory. */
  dir: string
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

function readPackage(dir: string): PackageDetails | null {
  const pkgJsonPath = join(dir, 'package.json')
  if (!existsSync(pkgJsonPath)) return null
  const json = JSON.parse(readFileSync(pkgJsonPath, 'utf8')) as { name?: string; version?: string; private?: boolean }
  if (!json.name || !json.version) return null
  return { name: json.name, version: json.version, private: Boolean(json.private), dir, pkgJsonPath }
}

function readGroup(group: string): PackageDetails[] {
  const groupDir = join(REPO_ROOT, group)
  if (!existsSync(groupDir)) return []
  return readdirSync(groupDir)
    .map((entry) => readPackage(join(groupDir, entry)))
    .filter((p): p is PackageDetails => p !== null)
}

/** Every releasable workspace package (packages/* + templates/* + examples/*), sorted by name. */
export function getReleasablePackages(): PackageDetails[] {
  return RELEASE_GROUPS.flatMap(readGroup).sort((a, b) => a.name.localeCompare(b.name))
}

/** Packages actually published to npm: non-private `packages/*` only. Templates,
 *  examples, and tools are never published. Sorted by name. */
export function getPublishablePackages(): PackageDetails[] {
  return readGroup('packages')
    .filter((p) => !p.private)
    .sort((a, b) => a.name.localeCompare(b.name))
}
