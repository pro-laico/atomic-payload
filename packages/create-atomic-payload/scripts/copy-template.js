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
import { cpSync, mkdirSync, existsSync, rmSync, readFileSync, writeFileSync, readdirSync } from 'fs'
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

console.log(`Template copied to package/template (${workspaceVersions.size} workspace deps inspected)`)
