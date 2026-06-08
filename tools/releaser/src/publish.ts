import { parseArgs } from 'node:util'
import { stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline/promises'
import { execFileSync } from 'node:child_process'

import { getPublishablePackages } from './getPackageDetails'

/**
 * Publish every publishable package (non-private `packages/*`) to npm — modeled
 * on Payload's `tools/releaser`. Each `pnpm publish` runs the package's
 * `prepack` (swc/tsc build, scaffold bundling), and pnpm rewrites `workspace:*`
 * deps to the concrete version. Versions already on the registry are skipped, so
 * re-running after a partial failure is safe.
 *
 * Run AFTER `pnpm release` has stamped + tagged the version.
 *
 * Usage (from repo root):
 *   pnpm publish-packages --dry-run            # build + pack every package, no upload
 *   pnpm publish-packages                      # publish at dist-tag "latest"
 *   pnpm publish-packages --tag beta
 *   pnpm publish-packages --provenance --yes   # CI: signed provenance, no prompt
 */

// `pnpm`/`npm` are `.cmd` shims on Windows, which Node can only launch via a
// shell. Since args then flow through a shell, validate anything caller-supplied.
const RUN_OPTS = { shell: true } as const

/** Is `name@version` already on the npm registry? */
function isPublished(name: string, version: string): boolean {
  try {
    const out = execFileSync('npm', ['view', `${name}@${version}`, 'version'], {
      ...RUN_OPTS,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return out === version
  } catch {
    // `npm view` exits non-zero when the package/version doesn't exist yet.
    return false
  }
}

async function confirm(question: string): Promise<boolean> {
  const rl = createInterface({ input: stdin, output: stdout })
  const answer = (await rl.question(`${question} (y/N) `)).trim().toLowerCase()
  rl.close()
  return answer === 'y' || answer === 'yes'
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      tag: { type: 'string', default: 'latest' },
      'dry-run': { type: 'boolean', default: false },
      provenance: { type: 'boolean', default: false },
      yes: { type: 'boolean', default: false },
    },
  })
  const dryRun = values['dry-run']
  const tag = values.tag as string
  if (!/^[a-zA-Z0-9._-]+$/.test(tag)) {
    console.error(`[releaser] Invalid --tag "${tag}". Use letters, numbers, ".", "_", "-".`)
    process.exit(1)
  }

  const packages = getPublishablePackages()
  const plan = packages.map((p) => ({ ...p, published: !dryRun && isPublished(p.name, p.version) }))
  const toPublish = plan.filter((p) => dryRun || !p.published)

  console.log(`\n${dryRun ? 'Dry-run publish' : 'Publish'} — dist-tag "${tag}"${values.provenance ? ', with provenance' : ''}:\n`)
  for (const p of plan) {
    const status = p.published ? '  (already on npm — skip)' : ''
    console.log(`  ${p.name.padEnd(36)} ${p.version}${status}`)
  }
  console.log('')

  if (toPublish.length === 0) {
    console.log('Nothing to publish — every version is already on the registry.\n')
    return
  }

  if (!dryRun && !values.yes && !(await confirm(`Publish ${toPublish.length} package(s) to npm at "${tag}"?`))) {
    console.log('Aborted.')
    return
  }

  const failed: string[] = []
  for (const p of toPublish) {
    const args = ['publish', '--access', 'public', '--no-git-checks', '--tag', tag]
    if (values.provenance) args.push('--provenance')
    if (dryRun) args.push('--dry-run')
    console.log(`\n→ ${p.name}@${p.version}`)
    try {
      execFileSync('pnpm', args, { ...RUN_OPTS, cwd: p.dir, stdio: 'inherit' })
    } catch {
      failed.push(p.name)
    }
  }

  if (failed.length > 0) {
    console.error(`\n✗ Failed to publish: ${failed.join(', ')}`)
    process.exit(1)
  }
  console.log(`\n✓ ${dryRun ? 'Dry-run complete' : `Published ${toPublish.length} package(s)`} at "${tag}".\n`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
