#!/usr/bin/env node
/**
 * Copies the template into the package for npm publish.
 * Run before `pnpm pack` or `npm publish`.
 *
 * The source template uses pnpm workspace deps (`@pro-laico/X: "workspace:*"`).
 * Those won't resolve in a scaffolded project, so this script rewrites them to
 * caret-pinned versions read from each `packages/<name>/package.json` before
 * the template is bundled. Any `workspace:*` reference whose package has no
 * corresponding `packages/<name>` directory will fail loudly so we don't ship
 * a broken tarball.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const monorepoRoot = path.join(__dirname, '..', '..', '..')
const templateSource = path.join(monorepoRoot, 'templates', 'atomic-payload')
const templateDest = path.join(__dirname, '..', 'template')
const packagesDir = path.join(monorepoRoot, 'packages')

if (!existsSync(templateSource)) {
  console.error('Template not found at:', templateSource)
  process.exit(1)
}

if (existsSync(templateDest)) {
  rmSync(templateDest, { recursive: true })
}
mkdirSync(templateDest, { recursive: true })
cpSync(templateSource, templateDest, {
  recursive: true,
  filter: (src) => {
    const name = path.basename(src)
    const relative = path.relative(templateSource, src).split(path.sep).join('/')
    const excludeByName = ['node_modules', '.next', '.git', '.env'].includes(name) || name.endsWith('.tsbuildinfo')
    const excludeFonts = relative === 'public/fonts' || relative.startsWith('public/fonts/')
    return !excludeByName && !excludeFonts
  },
})

// Build a map of @pro-laico/<name> → version by reading each packages/<name>/package.json.
const workspaceVersions = new Map()
for (const dir of readdirSync(packagesDir)) {
  const pkgJsonPath = path.join(packagesDir, dir, 'package.json')
  if (!existsSync(pkgJsonPath)) continue
  try {
    const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'))
    if (pkg.name && pkg.version) workspaceVersions.set(pkg.name, pkg.version)
  } catch (err) {
    console.error(`Failed to read ${pkgJsonPath}: ${err.message}`)
    process.exit(1)
  }
}

// Rewrite `workspace:*` deps in the copied template's package.json to caret-pinned versions.
const destPkgPath = path.join(templateDest, 'package.json')
const destPkg = JSON.parse(readFileSync(destPkgPath, 'utf8'))
const unresolved = []

for (const depField of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
  const deps = destPkg[depField]
  if (!deps) continue
  for (const [name, range] of Object.entries(deps)) {
    if (typeof range !== 'string' || !range.startsWith('workspace:')) continue
    const version = workspaceVersions.get(name)
    if (!version) {
      unresolved.push(`${depField}.${name} (${range})`)
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

writeFileSync(destPkgPath, JSON.stringify(destPkg, null, 2) + '\n')

// Write a self-contained biome.json into the scaffolded template. The monorepo's
// root biome.json governs the whole workspace, so we don't keep nested copies in
// `templates/*` (Biome 2.4 disallows multiple roots in one project). End users who
// scaffold a new project DO need their own biome.json, so synthesize one here.
const templateBiomeConfig = {
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
  formatter: {
    enabled: true,
    formatWithErrors: false,
    indentStyle: 'space',
    indentWidth: 2,
    lineWidth: 150,
    lineEnding: 'lf',
  },
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
  json: {
    formatter: { enabled: true, trailingCommas: 'none' },
    parser: { allowComments: true, allowTrailingCommas: true },
  },
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
  overrides: [
    {
      includes: ['**/*.config.{js,mjs,cjs,ts}', '**/scripts/**'],
      linter: { rules: { suspicious: { noConsole: 'off' } } },
    },
  ],
}
writeFileSync(path.join(templateDest, 'biome.json'), JSON.stringify(templateBiomeConfig, null, 2) + '\n')

console.log(`Template copied to package/template (${workspaceVersions.size} workspace deps inspected)`)
