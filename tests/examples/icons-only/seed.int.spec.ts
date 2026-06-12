import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

/**
 * Seed test for the icons-only example app. Boots the example's REAL Payload
 * config on in-memory SQLite and runs its extracted `seedIcons()` — the same
 * function the `/api/seed` route calls — then asserts the result.
 *
 * `sampleIcons` reads its SVG folders relative to `process.cwd()`, and uploads
 * land under cwd too, so the suite runs with cwd set to the example root and
 * cleans up the upload dirs afterward.
 */
const exampleRoot = fileURLToPath(new URL('../../../examples/icons-only', import.meta.url))

describe('icons-only example seed', () => {
  let payload: Payload
  let originalCwd: string

  beforeAll(async () => {
    originalCwd = process.cwd()
    process.chdir(exampleRoot)

    process.env.DATABASE_URI = ':memory:'
    process.env.PAYLOAD_SECRET = 'test-secret'
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3000'

    const { default: config } = await import('@/payload.config')
    payload = await getPayload({ config })
  })

  afterAll(async () => {
    await (payload?.db as { destroy?: () => Promise<void> })?.destroy?.()
    if (originalCwd) process.chdir(originalCwd)
    // Uploaded SVGs land on disk relative to cwd; clean them up.
    for (const dir of ['icon', 'media']) rmSync(resolve(exampleRoot, dir), { recursive: true, force: true })
  })

  it('seeds every sample icon set with distinct filenames', async () => {
    const { seedIcons } = await import('@/seed/seed')
    const { sampleIconSets } = await import('@/seed/sampleIcons')

    const { sets } = await seedIcons({ payload })

    // One iconSet per sample set, each created (fresh DB).
    expect(sets).toHaveLength(sampleIconSets.length)
    expect(sets.every((s) => s.iconSet === 'created')).toBe(true)

    const iconSets = await payload.count({ collection: 'iconSet', overrideAccess: true })
    expect(iconSets.totalDocs).toBe(sampleIconSets.length)

    // Every uploaded icon must keep a distinct filename (set-prefixed in the
    // sample data) — a collision would fail on the `filename` unique index.
    const expectedFilenames = sampleIconSets.flatMap((s) => s.icons.map((i) => i.filename))
    const icons = await payload.find({ collection: 'icon', overrideAccess: true, limit: 0, pagination: false })
    const filenames = icons.docs.map((d) => (d as { filename?: string }).filename).sort()
    expect(filenames).toEqual([...expectedFilenames].sort())
  })

  it('re-seeding replaces the data instead of erroring or duplicating', async () => {
    const { seedIcons } = await import('@/seed/seed')
    const { sampleIconSets } = await import('@/seed/sampleIcons')

    // Runs against the state left by the previous test (same in-memory DB), so
    // this is the real re-seed path: every icon already exists on disk + in the
    // DB. It must delete-then-recreate, not collide on the unique `filename`.
    const { sets } = await seedIcons({ payload })

    // Each icon already existed, so it's reported as replaced, not created.
    const expectedFilenames = sampleIconSets.flatMap((s) => s.icons.map((i) => i.filename))
    expect(sets.flatMap((s) => s.replaced).sort()).toEqual([...expectedFilenames].sort())
    expect(sets.flatMap((s) => s.created)).toEqual([])

    // Counts and filenames are unchanged — no duplicates, no `-1` suffixes.
    const iconSets = await payload.count({ collection: 'iconSet', overrideAccess: true })
    expect(iconSets.totalDocs).toBe(sampleIconSets.length)

    const icons = await payload.find({ collection: 'icon', overrideAccess: true, limit: 0, pagination: false })
    const filenames = icons.docs.map((d) => (d as { filename?: string }).filename).sort()
    expect(filenames).toEqual([...expectedFilenames].sort())
  })
})
