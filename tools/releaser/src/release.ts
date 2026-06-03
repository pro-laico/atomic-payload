import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline/promises'
import { parseArgs } from 'node:util'

import { getReleasablePackages, REPO_ROOT, ROOT_PACKAGE_JSON } from './getPackageDetails'

const RELEASE_TYPES = ['patch', 'minor', 'major', 'prerelease'] as const
type ReleaseType = (typeof RELEASE_TYPES)[number]

/**
 * Lockstep version bump for the whole monorepo — modelled on Payload's
 * `tools/releaser`. Reads the root `package.json` version as the source of
 * truth, computes the next version, and stamps it into the root plus every
 * releasable workspace package (`packages/*` + `templates/*`), then commits and
 * tags. Internal `workspace:*` deps are left untouched — pnpm rewrites them to
 * the concrete version at publish time.
 *
 * Usage (from repo root):
 *   pnpm release                         # patch bump, interactive confirm
 *   pnpm --filter @tools/releaser release --bump minor
 *   pnpm --filter @tools/releaser release --bump prerelease --preid beta
 *   pnpm --filter @tools/releaser release --dry-run
 */

/** Pure SemVer increment (patch/minor/major/prerelease) — no external deps. */
function incVersion(current: string, type: ReleaseType, preid: string): string {
  const [core, pre] = current.split('-')
  const parts = core.split('.').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) throw new Error(`[releaser] Unparseable version: "${current}"`)
  const [major, minor, patch] = parts as [number, number, number]

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
    case 'prerelease': {
      const prefix = `${preid}.`
      if (pre?.startsWith(prefix)) {
        const n = Number(pre.slice(prefix.length))
        return `${major}.${minor}.${patch}-${preid}.${Number.isNaN(n) ? 0 : n + 1}`
      }
      // Begin a fresh prerelease on the next patch (e.g. 0.2.0 -> 0.2.1-beta.0).
      return `${major}.${minor}.${patch + 1}-${preid}.0`
    }
  }
}

/** Replace only the top-level `"version"` string, preserving all other
 *  formatting so Biome stays happy. */
function stampVersion(pkgJsonPath: string, next: string): void {
  const text = readFileSync(pkgJsonPath, 'utf8')
  const updated = text.replace(/("version":\s*")[^"]*(")/, `$1${next}$2`)
  if (updated === text) throw new Error(`[releaser] No "version" field found in ${pkgJsonPath}`)
  writeFileSync(pkgJsonPath, updated)
}

async function confirm(question: string): Promise<boolean> {
  const rl = createInterface({ input: stdin, output: stdout })
  const answer = (await rl.question(`${question} (y/N) `)).trim().toLowerCase()
  rl.close()
  return answer === 'y' || answer === 'yes'
}

function git(args: string[]): void {
  execFileSync('git', args, { cwd: REPO_ROOT, stdio: 'inherit' })
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      bump: { type: 'string', default: 'patch' },
      preid: { type: 'string', default: 'beta' },
      'dry-run': { type: 'boolean', default: false },
      yes: { type: 'boolean', default: false },
      'skip-git': { type: 'boolean', default: false },
    },
  })

  const bump = values.bump as ReleaseType
  if (!RELEASE_TYPES.includes(bump)) {
    console.error(`[releaser] Invalid --bump "${values.bump}". Expected one of: ${RELEASE_TYPES.join(', ')}`)
    process.exit(1)
  }
  const dryRun = values['dry-run']

  const root = JSON.parse(readFileSync(ROOT_PACKAGE_JSON, 'utf8')) as { version: string }
  const current = root.version
  const next = incVersion(current, bump, values.preid as string)
  const packages = getReleasablePackages()

  console.log(`\nMonorepo version: ${current}  ->  ${next}  (${bump})`)
  console.log(`Stamping ${packages.length + 1} package.json files (root + ${packages.length} workspace):\n`)
  console.log(`  ${'(root) atomic-payload-monorepo'.padEnd(36)} ${current}  ->  ${next}`)
  for (const p of packages) {
    console.log(`  ${p.name.padEnd(36)} ${p.version}  ->  ${next}${p.private ? '   (private)' : ''}`)
  }
  console.log('')

  if (dryRun) {
    console.log('Dry run — no files written, no git operations.\n')
    return
  }

  if (!values.yes && !(await confirm('Write these versions' + (values['skip-git'] ? '' : ', commit, and tag') + '?'))) {
    console.log('Aborted.')
    return
  }

  stampVersion(ROOT_PACKAGE_JSON, next)
  for (const p of packages) stampVersion(p.pkgJsonPath, next)
  console.log(`✓ Stamped v${next} across ${packages.length + 1} package.json files.`)

  if (!values['skip-git']) {
    git(['add', '-A'])
    git(['commit', '-m', `chore(release): v${next}`])
    git(['tag', '-a', `v${next}`, '-m', `v${next}`])
    console.log(`✓ Committed and tagged v${next}.`)
    console.log('  Push with:  git push --follow-tags')
  }
  console.log('')
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
