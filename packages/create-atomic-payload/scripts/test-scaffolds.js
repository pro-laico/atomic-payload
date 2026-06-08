#!/usr/bin/env node
/**
 * End-to-end test for `create-atomic-payload` and every project it scaffolds.
 *
 * This reproduces the *published* experience as faithfully as a local run can,
 * because the bugs that bite users live in the gap between the dev tree and the
 * tarball (the `files` allowlist, the `prepack` bundle that rewrites
 * `workspace:*` deps and writes `pnpm-workspace.yaml`/`biome.json`, the
 * `gitignore.template` → `.gitignore` rename). So instead of running the dev
 * `bin/cli.js` against `templates/`, it:
 *
 *   1. `pnpm pack`s the CLI → a real tarball (runs `prepack`, i.e. the bundler).
 *   2. `npm install`s that tarball into a throwaway dir, so the CLI runs with its
 *      bundled scaffolds and its own runtime deps (ora/chalk/execa) — exactly
 *      what `npx @pro-laico/create-atomic-payload` gets.
 *   3. For each selected scaffold, runs the installed CLI to create a project in
 *      a temp dir OUTSIDE this repo (so pnpm doesn't walk up into the monorepo
 *      workspace), then verifies it.
 *
 * Verification levels (per scaffold):
 *   install   — the CLI exits 0 (its `pnpm install` + sharp rebuild succeeded),
 *               the generated `pnpm-workspace.yaml` approves native builds, and
 *               sharp's native binary actually got built (the original bug shipped
 *               a project that "installed" but had no sharp binary).
 *   typecheck — `pnpm typecheck` (tsc --noEmit) passes. No database needed.
 *   build     — `pnpm build` (next build) passes against a test `.env`. The app is
 *               built to tolerate an unreachable DB at build time.
 *
 * Everything runs under the OS temp dir and is removed afterwards (`--keep` to
 * retain for debugging). Exits non-zero if any check fails.
 *
 * Usage:
 *   node scripts/test-scaffolds.js                 # all scaffolds, install+typecheck+build
 *   node scripts/test-scaffolds.js -t atomic-payload
 *   node scripts/test-scaffolds.js --smoke         # install only (fast)
 *   node scripts/test-scaffolds.js --no-build      # install + typecheck
 *   node scripts/test-scaffolds.js --keep          # leave the temp workspace on disk
 */
import os from 'node:os'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { fileURLToPath } from 'node:url'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

import { execa } from 'execa'

import { scaffolds } from '../scaffolds.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkgDir = path.join(__dirname, '..')

// A complete-enough .env so `next build` can boot Payload. Values are dummy but
// syntactically valid; the build doesn't need a reachable database.
const TEST_ENV = {
  MONGODB_URI: 'mongodb://127.0.0.1:27017/atomic-payload-scaffold-test',
  PAYLOAD_SECRET: 'scaffold-test-secret-please-do-not-use-in-prod',
  PREVIEW_SECRET: 'scaffold-test-preview-secret',
  NEXT_PUBLIC_SERVER_URL: 'http://localhost:3000',
  FONT_DOWNLOAD_URL: 'http://localhost:3000',
}

const c = {
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  gray: (s) => `\x1b[90m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
}

function log(msg) {
  console.log(`\n${c.cyan('▸')} ${c.bold(msg)}`)
}

/** Run a command, streaming its output, returning the exit code (never throws). */
async function run(file, args, cwd, extraEnv) {
  const { exitCode } = await execa(file, args, {
    cwd,
    stdio: 'inherit',
    reject: false,
    env: extraEnv ? { ...process.env, ...extraEnv } : process.env,
  })
  return exitCode ?? 1
}

/**
 * Status of sharp's native binary in the project:
 *   'absent' — the scaffold doesn't *declare* sharp (any transitive copy isn't
 *              its concern; minimal examples legitimately have none),
 *   'built'  — sharp is declared and its native binary is present,
 *   'missing'— sharp is declared but no native binary was produced (the bug).
 * Only 'missing' is a failure. Handles both sharp packaging styles: <=0.32 builds
 * a `build/Release/*.node` addon (needs the approved install script — the exact
 * thing the allowBuilds regression broke); >=0.33 ships prebuilt `@img/sharp-*`
 * platform packages instead.
 */
function sharpStatus(projectDir) {
  const pkg = JSON.parse(readFileSync(path.join(projectDir, 'package.json'), 'utf8'))
  if (!(pkg.dependencies?.sharp || pkg.devDependencies?.sharp)) return 'absent'
  const pnpmDir = path.join(projectDir, 'node_modules', '.pnpm')
  if (!existsSync(pnpmDir)) return 'missing'
  const entries = readdirSync(pnpmDir)
  // sharp >=0.33: prebuilt platform binding package (not the libvips shared lib).
  if (entries.some((e) => e.startsWith('@img+sharp-') && !e.startsWith('@img+sharp-libvips'))) return 'built'
  // sharp <=0.32: compiled addon under build/Release.
  for (const entry of entries.filter((e) => e.startsWith('sharp@'))) {
    const release = path.join(pnpmDir, entry, 'node_modules', 'sharp', 'build', 'Release')
    if (existsSync(release) && readdirSync(release).some((f) => f.endsWith('.node'))) return 'built'
  }
  return 'missing'
}

async function main() {
  const { values } = parseArgs({
    options: {
      template: { type: 'string', short: 't', multiple: true },
      smoke: { type: 'boolean', default: false },
      'no-typecheck': { type: 'boolean', default: false },
      'no-build': { type: 'boolean', default: false },
      keep: { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  })

  if (values.help) {
    console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0].replace(/^#![^\n]*\n/, ''))
    return
  }

  const doTypecheck = !values.smoke && !values['no-typecheck']
  const doBuild = !values.smoke && !values['no-build']

  // Resolve which scaffolds to test.
  let selected = scaffolds
  if (values.template?.length) {
    const names = values.template.flatMap((t) => t.split(','))
    selected = names.map((n) => {
      const match = scaffolds.find((s) => s.name === n)
      if (!match) {
        console.error(c.red(`Unknown scaffold "${n}". Available: ${scaffolds.map((s) => s.name).join(', ')}`))
        process.exit(1)
      }
      return match
    })
  }

  const workRoot = mkdtempSync(path.join(os.tmpdir(), 'cap-test-'))
  const tarballDir = path.join(workRoot, 'tarball')
  const installerDir = path.join(workRoot, 'installer')
  const projectsDir = path.join(workRoot, 'projects')
  for (const d of [tarballDir, installerDir, projectsDir]) mkdirSync(d, { recursive: true })

  console.log(c.gray(`Workspace: ${workRoot}`))
  console.log(c.gray(`Scaffolds: ${selected.map((s) => s.name).join(', ')}`))
  console.log(c.gray(`Levels:    install${doTypecheck ? ' + typecheck' : ''}${doBuild ? ' + build' : ''}`))

  try {
    // 1. Pack the CLI into a tarball (runs prepack → bundle-scaffolds.js).
    log('Packing create-atomic-payload (runs prepack bundle)')
    await execa('pnpm', ['pack', '--pack-destination', tarballDir], { cwd: pkgDir, stdio: 'inherit' })
    const tgz = readdirSync(tarballDir).find((f) => f.endsWith('.tgz'))
    if (!tgz) throw new Error('pnpm pack produced no .tgz')
    const tgzPath = path.join(tarballDir, tgz)

    // 2. Install the tarball so the CLI runs with bundled scaffolds + its deps.
    log('Installing the tarball (simulates `npx ...`)')
    writeFileSync(path.join(installerDir, 'package.json'), `${JSON.stringify({ name: 'cap-installer', private: true }, null, 2)}\n`)
    await execa('npm', ['install', tgzPath, '--omit=dev', '--no-audit', '--no-fund'], { cwd: installerDir, stdio: 'inherit' })
    const cliBin = path.join(installerDir, 'node_modules', '@pro-laico', 'create-atomic-payload', 'bin', 'cli.js')
    if (!existsSync(cliBin)) throw new Error(`CLI not found after install: ${cliBin}`)

    // 3. Scaffold + verify each.
    const results = []
    for (const scaffold of selected) {
      const projName = `${scaffold.name}-app`
      const projectDir = path.join(projectsDir, projName)
      const r = { name: scaffold.name, install: false, typecheck: null, build: null, note: '' }

      log(`[${scaffold.name}] Scaffolding (copy + pnpm install + sharp rebuild)`)
      const cliExit = await run('node', [cliBin, projName, '-t', scaffold.name], projectsDir)

      // install-level assertions
      const wsPath = path.join(projectDir, 'pnpm-workspace.yaml')
      const ws = existsSync(wsPath) ? readFileSync(wsPath, 'utf8') : ''
      const approvesBuilds = /allowBuilds:/.test(ws) && /sharp:\s*true/.test(ws)
      const sharp = sharpStatus(projectDir)
      r.install = cliExit === 0 && approvesBuilds && sharp !== 'missing'
      if (cliExit !== 0) r.note = `CLI exited ${cliExit}`
      else if (!approvesBuilds) r.note = 'pnpm-workspace.yaml missing allowBuilds/sharp'
      else if (sharp === 'missing') r.note = 'sharp installed but native binary not built'
      else if (sharp === 'absent') r.note = 'no sharp (ok)'

      if (r.install) {
        if (doTypecheck) {
          log(`[${scaffold.name}] Typecheck`)
          r.typecheck = (await run('pnpm', ['typecheck'], projectDir)) === 0
        }
        if (doBuild) {
          writeFileSync(path.join(projectDir, '.env'), `${Object.entries(TEST_ENV).map(([k, v]) => `${k}=${v}`).join('\n')}\n`)
          log(`[${scaffold.name}] Build (next build)`)
          r.build = (await run('pnpm', ['build'], projectDir, TEST_ENV)) === 0
        }
      } else {
        console.error(c.red(`  ✗ install failed for ${scaffold.name}: ${r.note}`))
      }
      results.push(r)
    }

    // Summary
    const mark = (v) => (v === null ? c.gray('  —  ') : v ? c.green(' pass') : c.red(' FAIL'))
    console.log(`\n${c.bold('  Results')}`)
    console.log(c.gray(`  ${'scaffold'.padEnd(18)} install  typecheck  build   note`))
    let failed = false
    for (const r of results) {
      if (!r.install || r.typecheck === false || r.build === false) failed = true
      console.log(`  ${r.name.padEnd(18)}${mark(r.install)}    ${mark(r.typecheck)}     ${mark(r.build)}   ${c.gray(r.note)}`)
    }

    if (values.keep) console.log(c.yellow(`\n  Kept workspace: ${workRoot}`))
    else rmSync(workRoot, { recursive: true, force: true })

    if (failed) {
      console.log(c.red('\n  ✗ Some scaffolds failed.\n'))
      process.exit(1)
    }
    console.log(c.green('\n  ✓ All scaffolds passed.\n'))
  } catch (err) {
    console.error(c.red(`\n  ✗ Harness error: ${err.message}`))
    if (!values.keep) rmSync(workRoot, { recursive: true, force: true })
    else console.log(c.yellow(`  Kept workspace: ${workRoot}`))
    process.exit(1)
  }
}

main()
