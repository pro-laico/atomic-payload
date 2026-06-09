import { readFile } from 'node:fs/promises'
import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

/**
 * Seed test for the fonts-only example app. Boots the example's REAL Payload
 * config on in-memory SQLite and runs its extracted `seedFonts()` — the same
 * function the `/api/seed` route calls — with a disk loader (the route uses an
 * HTTP origin loader). Asserts the uploaded fonts + the `fontSet` global.
 *
 * Uploads land in `FONT_STATIC_DIR` (= `<cwd>/media`), so the suite runs with
 * cwd at the example root and cleans that dir up afterward.
 */
const exampleRoot = fileURLToPath(new URL('../../../examples/fonts-only', import.meta.url))
const loadFromDisk = (file: string): Promise<Buffer> => readFile(resolve(exampleRoot, 'public', 'seed-fonts', file))

describe('fonts-only example seed', () => {
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
    rmSync(resolve(exampleRoot, 'media'), { recursive: true, force: true })
  })

  it('uploads every sample font and activates the fontSet global', async () => {
    const { seedFonts } = await import('@/seed/seed')
    const { sampleFonts } = await import('@/seed/sampleFonts')

    const { created, skipped } = await seedFonts({ payload, loadFile: loadFromDisk })

    // Fresh DB: every sample font is created, none skipped.
    expect(created.sort()).toEqual(sampleFonts.map((f) => f.title).sort())
    expect(skipped).toEqual([])

    const fonts = await payload.count({ collection: 'font', overrideAccess: true })
    expect(fonts.totalDocs).toBe(sampleFonts.length)

    // The fontSet global points one font at each role the sample data covers.
    const fontSet = (await payload.findGlobal({ slug: 'fontSet', overrideAccess: true })) as Record<string, unknown>
    for (const family of sampleFonts.map((f) => f.family)) {
      expect(fontSet[family]).toBeTruthy()
    }
  })
})
