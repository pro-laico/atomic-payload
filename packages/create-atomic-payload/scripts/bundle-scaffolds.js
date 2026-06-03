#!/usr/bin/env node
/**
 * Bundles every scaffold (templates/* + examples/*, per `scaffolds.js`) into the
 * package for npm publish. Run before `pnpm pack` / `npm publish` (via prepack).
 *
 * Each scaffold uses pnpm workspace deps (`@pro-laico/X: "workspace:*"`). Those
 * won't resolve in a scaffolded project, so each is rewritten to a caret-pinned
 * version read from `packages/<name>/package.json` before bundling. A
 * `workspace:*` reference with no matching `packages/<name>` directory fails
 * loudly so we don't ship a broken tarball. Each scaffold also gets a
 * self-contained `biome.json` (the monorepo's root config governs the workspace,
 * so scaffolds don't keep nested copies, but end users need their own).
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

import { scaffolds } from '../scaffolds.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const monorepoRoot = path.join(__dirname, '..', '..', '..')
const packagesDir = path.join(monorepoRoot, 'packages')
const scaffoldsDest = path.join(__dirname, '..', 'scaffolds')

// Self-contained Biome config written into every scaffolded project.
const SCAFFOLD_BIOME_CONFIG = {
  $schema: 'https://biomejs.dev/schemas/2.4.15/schema.json',
  vcs: { enabled: true, clientKind: 'git', useIgnoreFile: true, defaultBranch: 'main' },
  files: {
    includes: [
      '**',
      '!**/node_modules',
      '!**/.next',
      '!**/out',
      '!**/build',
      '!**/dist',
      '!**/.turbo',
      '!**/.vercel',
      '!**/next-env.d.ts',
      '!**/pnpm-lock.yaml',
      '!**/*.generated.*',
      '!**/payload-types.ts',
      '!**/importMap.js',
      '!**/*.tsbuildinfo',
    ],
  },
  formatter: { enabled: true, formatWithErrors: false, indentStyle: 'space', indentWidth: 2, lineWidth: 150, lineEnding: 'lf' },
  javascript: {
    formatter: {
      quoteStyle: 'single',
      jsxQuoteStyle: 'double',
      trailingCommas: 'all',
      semicolons: 'asNeeded',
      arrowParentheses: 'always',
      bracketSpacing: true,
      bracketSameLine: false,
      quoteProperties: 'asNeeded',
    },
  },
  json: { formatter: { enabled: true, trailingCommas: 'none' }, parser: { allowComments: true, allowTrailingCommas: true } },
  css: { formatter: { enabled: true, quoteStyle: 'double' } },
  assist: { enabled: true, actions: { source: { organizeImports: 'on' } } },
  linter: {
    enabled: true,
    rules: {
      recommended: true,
      suspicious: {
        noExplicitAny: 'off',
        noTsIgnore: 'warn',
        noEmptyInterface: 'off',
        noImplicitAnyLet: 'warn',
        noFallthroughSwitchClause: 'warn',
        noArrayIndexKey: 'warn',
        useIterableCallbackReturn: 'warn',
      },
      complexity: { noBannedTypes: 'warn' },
      correctness: {
        noUnusedVariables: 'warn',
        noUnusedFunctionParameters: 'off',
        noUnusedImports: 'warn',
        useExhaustiveDependencies: 'warn',
        noUnsafeOptionalChaining: 'warn',
        useJsxKeyInIterable: 'warn',
      },
      style: { useImportType: 'warn' },
      security: { noDangerouslySetInnerHtml: 'off' },
      a11y: { noSvgWithoutTitle: 'off', useButtonType: 'warn' },
    },
  },
  overrides: [{ includes: ['**/*.config.{js,mjs,cjs,ts}', '**/scripts/**'], linter: { rules: { suspicious: { noConsole: 'off' } } } }],
}

/** Build a map of @pro-laico/<name> → version from each packages/<name>/package.json. */
function readWorkspaceVersions() {
  const versions = new Map()
  for (const dir of readdirSync(packagesDir)) {
    const pkgJsonPath = path.join(packagesDir, dir, 'package.json')
    if (!existsSync(pkgJsonPath)) continue
    try {
      const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'))
      if (pkg.name && pkg.version) versions.set(pkg.name, pkg.version)
    } catch (err) {
      console.error(`Failed to read ${pkgJsonPath}: ${err.message}`)
      process.exit(1)
    }
  }
  return versions
}

/** Copy one scaffold into the bundle, rewrite its workspace deps, write biome.json. */
function bundleScaffold(scaffold, workspaceVersions) {
  const source = path.join(monorepoRoot, scaffold.dir)
  const dest = path.join(scaffoldsDest, scaffold.name)
  if (!existsSync(path.join(source, 'package.json'))) {
    console.error(`Scaffold "${scaffold.name}" not found at: ${source}`)
    process.exit(1)
  }

  // Copy only git-tracked files so the bundle matches the committed source —
  // this excludes all runtime/gitignored junk (.next, *.db, seed assets like
  // icon/, generated definition.ts, downloaded fonts, .env, etc.) automatically.
  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: source, encoding: 'utf8' }).split('\0').filter(Boolean)
  for (const rel of tracked) {
    const from = path.join(source, rel)
    const to = path.join(dest, rel)
    mkdirSync(path.dirname(to), { recursive: true })
    copyFileSync(from, to)
  }

  // Rewrite `workspace:*` deps to caret-pinned versions.
  const destPkgPath = path.join(dest, 'package.json')
  const destPkg = JSON.parse(readFileSync(destPkgPath, 'utf8'))
  const unresolved = []
  for (const depField of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    const deps = destPkg[depField]
    if (!deps) continue
    for (const [name, range] of Object.entries(deps)) {
      if (typeof range !== 'string' || !range.startsWith('workspace:')) continue
      const version = workspaceVersions.get(name)
      if (!version) {
        unresolved.push(`${scaffold.name}: ${depField}.${name} (${range})`)
        continue
      }
      deps[name] = `^${version}`
    }
  }
  if (unresolved.length > 0) {
    console.error('Cannot resolve workspace dependencies (no matching package found in packages/):')
    for (const entry of unresolved) console.error(`  - ${entry}`)
    process.exit(1)
  }
  writeFileSync(destPkgPath, `${JSON.stringify(destPkg, null, 2)}\n`)
  writeFileSync(path.join(dest, 'biome.json'), `${JSON.stringify(SCAFFOLD_BIOME_CONFIG, null, 2)}\n`)
}

if (existsSync(scaffoldsDest)) rmSync(scaffoldsDest, { recursive: true })
mkdirSync(scaffoldsDest, { recursive: true })

const workspaceVersions = readWorkspaceVersions()
for (const scaffold of scaffolds) bundleScaffold(scaffold, workspaceVersions)

console.log(`Bundled ${scaffolds.length} scaffolds (${scaffolds.map((s) => s.name).join(', ')}); ${workspaceVersions.size} workspace deps inspected.`)
