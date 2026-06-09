#!/usr/bin/env node
/**
 * Drift guard for Payload's generated artifacts.
 *
 * `payload generate:importmap` and `payload generate:types` produce files that
 * are COMMITTED (src/app/(payload)/admin/importMap.js, src/payload-types.ts, and
 * the core-augment d.ts) and then merely CONSUMED by `next build` — nothing in
 * the test suite re-runs the generators. So a Payload bump (or a config change)
 * can silently make those committed files stale while everything stays green.
 *
 * This re-runs both generators for the template + every example and fails if the
 * regenerated output differs from what's committed. A failure means: run the
 * generators and commit the result. It also surfaces resolution bugs that only
 * bite the raw `payload` CLI (e.g. a package importing `server-only` without
 * declaring it) — those never show up under next/vitest, which shim that import.
 *
 * The generators don't need a reachable database (they read config, not data),
 * so this needs no DB — just config-load env, defaulted below.
 */
import { execFileSync } from 'node:child_process'

// pnpm is a .cmd shim on Windows, only launchable via a shell; args are static here.
const RUN = { shell: true, stdio: 'inherit' }

// Config-load env for `buildConfig`. Dummy values are fine — no DB is contacted.
const ENV_DEFAULTS = {
  PAYLOAD_SECRET: 'drift-check-secret',
  MONGODB_URI: 'mongodb://127.0.0.1:27017/atomic-payload-drift-check',
  NEXT_PUBLIC_SERVER_URL: 'http://localhost:3000',
  PREVIEW_SECRET: 'drift-check-preview',
  FONT_DOWNLOAD_URL: 'http://localhost:3000',
}
for (const [k, v] of Object.entries(ENV_DEFAULTS)) if (!process.env[k]) process.env[k] = v

// Workspace filter names of the Payload apps that ship generated artifacts.
const APPS = ['atomic-payload', 'fonts-only', 'icons-only', 'styles-only']

// Files the generators (re)write. git diff is line-ending aware via .gitattributes,
// so CRLF working trees won't false-positive here.
const GENERATED_GLOBS = ['**/admin/importMap.js', '**/payload-types.ts', '**/payload-types.augment.d.ts']

for (const app of APPS) {
  console.log(`\n→ ${app}: generate:importmap + generate:types`)
  execFileSync('pnpm', ['--filter', app, 'generate:importmap'], RUN)
  execFileSync('pnpm', ['--filter', app, 'generate:types'], RUN)
}

const drift = execFileSync('git', ['diff', '--name-only', '--', ...GENERATED_GLOBS], { encoding: 'utf8' }).trim()
if (drift) {
  console.error('\n✗ Generated artifacts are out of date. Re-run the generators and commit:')
  for (const f of drift.split('\n')) console.error(`    ${f}`)
  console.error('\n  (e.g. `pnpm --filter <app> generate:importmap && pnpm --filter <app> generate:types`)')
  process.exit(1)
}
console.log('\n✓ Generated artifacts (importMap + payload-types) are up to date.')
