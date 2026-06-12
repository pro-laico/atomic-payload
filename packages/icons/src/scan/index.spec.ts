import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { loadIconUsageManifest, resolveManifestPath, scanIconUsages, writeIconUsageManifest } from './index'

let root: string

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'icons-scan-'))
})

afterEach(() => {
  rmSync(root, { recursive: true, force: true })
})

const write = (rel: string, content: string): void => {
  const full = join(root, rel)
  mkdirSync(join(full, '..'), { recursive: true })
  writeFileSync(full, content, 'utf8')
}

describe('scanIconUsages', () => {
  it('aggregates literal names across files, sorted and de-duped', () => {
    write('src/a.tsx', '<Icon name="zeta" /><Icon name="alpha" />')
    write('src/nested/b.tsx', '<Icon name="alpha" /><Icon name="beta" />')

    const { manifest, filesScanned } = scanIconUsages({ cwd: root, roots: ['src'] })

    expect(filesScanned).toBe(2)
    expect(manifest.names).toEqual(['alpha', 'beta', 'zeta'])
    expect(manifest.version).toBe(1)
    expect(manifest.usages).toHaveLength(4)
    // Usages are sorted by (name, file, …) for diff-stable output.
    expect(manifest.usages.map((u) => u.name)).toEqual(['alpha', 'alpha', 'beta', 'zeta'])
    expect(manifest.usages[0].file).toMatch(/^src\//)
  })

  it('reports POSIX-style relative file paths', () => {
    write('src/deep/c.tsx', '<Icon name="x" />')
    const { manifest } = scanIconUsages({ cwd: root, roots: ['src'] })
    expect(manifest.usages[0].file).toBe('src/deep/c.tsx')
  })

  it('skips ignored directories', () => {
    write('src/keep.tsx', '<Icon name="keep" />')
    write('src/node_modules/dep.tsx', '<Icon name="drop" />')
    const { manifest } = scanIconUsages({ cwd: root, roots: ['src'] })
    expect(manifest.names).toEqual(['keep'])
  })

  it('only reads configured extensions', () => {
    write('src/a.tsx', '<Icon name="tsx" />')
    write('src/a.md', '<Icon name="md" />')
    const { manifest } = scanIconUsages({ cwd: root, roots: ['src'], extensions: ['tsx'] })
    expect(manifest.names).toEqual(['tsx'])
  })

  it('returns an empty manifest when a root is missing', () => {
    const { manifest, filesScanned } = scanIconUsages({ cwd: root, roots: ['does-not-exist'] })
    expect(filesScanned).toBe(0)
    expect(manifest.names).toEqual([])
  })
})

describe('manifest IO', () => {
  it('round-trips through write and load', () => {
    write('src/a.tsx', '<Icon name="x" />')
    const { manifest } = scanIconUsages({ cwd: root, roots: ['src'] })
    const out = join(root, 'manifest.json')
    writeIconUsageManifest(manifest, out)

    const loaded = loadIconUsageManifest(out)
    expect(loaded).toEqual(manifest)
  })

  it('returns null for a missing manifest', () => {
    expect(loadIconUsageManifest(join(root, 'nope.json'))).toBeNull()
  })

  it('returns null for malformed JSON', () => {
    const bad = join(root, 'bad.json')
    writeFileSync(bad, '{ not json', 'utf8')
    expect(loadIconUsageManifest(bad)).toBeNull()
  })
})

describe('resolveManifestPath', () => {
  it('prefers an explicit absolute path', () => {
    const abs = join(root, 'x.json')
    expect(resolveManifestPath(abs)).toBe(abs)
  })

  it('falls back to the default filename under cwd', () => {
    expect(resolveManifestPath(undefined, root)).toBe(join(root, 'icon-usage-manifest.json'))
  })
})
