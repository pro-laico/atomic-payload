import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

/**
 * Seed test for the images-only example app. Boots the example's REAL Payload
 * config on in-memory SQLite (with real Sharp, from the example config) and runs
 * its extracted `seedImages()` — the same function the `/api/seed` route calls —
 * then asserts the result. Uploads land under cwd, so the suite runs with cwd set
 * to the example root and cleans the upload dirs afterward.
 */
const exampleRoot = fileURLToPath(new URL('../../../examples/images-only', import.meta.url))

type ImageDoc = {
  alt?: string
  focalX?: number | null
  focalY?: number | null
  filename?: string | null
  filesize?: number | null
}

describe('images-only example seed', () => {
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
    for (const dir of ['images', 'generatedImages', 'media']) rmSync(resolve(exampleRoot, dir), { recursive: true, force: true })
  })

  it('seeds the sample images with focal points', async () => {
    const { seedImages, sampleImages } = await import('@/seed/seed')

    const { created } = await seedImages({ payload })
    expect(created).toHaveLength(sampleImages.length)

    const { totalDocs } = await payload.count({ collection: 'images', overrideAccess: true })
    expect(totalDocs).toBe(sampleImages.length)

    const docs = (await payload.find({ collection: 'images', overrideAccess: true, pagination: false })).docs as ImageDoc[]
    // Focal points persisted from the seed data.
    const landscape = docs.find((d) => d.alt === 'Landscape sample')
    expect(landscape?.focalX).toBe(78)
    expect(landscape?.focalY).toBe(32)
    // Each sample is a DISTINCT file — guards against the seed uploading one asset
    // under every name (e.g. a bundler mis-resolving a dynamic asset path).
    expect(new Set(docs.map((d) => d.filesize)).size).toBe(sampleImages.length)
  })

  it('re-seeding replaces the samples instead of duplicating them', async () => {
    const { seedImages, sampleImages } = await import('@/seed/seed')

    await seedImages({ payload })

    const { totalDocs } = await payload.count({ collection: 'images', overrideAccess: true })
    expect(totalDocs).toBe(sampleImages.length)

    const docs = (await payload.find({ collection: 'images', overrideAccess: true, pagination: false })).docs as ImageDoc[]
    const alts = docs.map((d) => d.alt).sort()
    expect(alts).toEqual(sampleImages.map((s) => s.alt).sort())
  })
})
