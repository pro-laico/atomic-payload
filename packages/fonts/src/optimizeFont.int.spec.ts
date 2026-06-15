import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { bootPayload, teardown } from '@tools/test-helpers'
import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { fontsPlugin } from './plugin'

// Optimization runs on `fontFile` (the weight-file upload). Point it at a temp
// staticDir and clean it + the default `fontOriginal` dir afterwards.
const FONT_DIR = path.join(os.tmpdir(), 'ap-fontfile-optimize-test')
const ORIGINAL_DIR = path.resolve(process.cwd(), 'fontOriginal')
const fixture = fs.readFileSync(fileURLToPath(new URL('./__fixtures__/inter.woff2', import.meta.url)))

describe('fontsPlugin optimize (integration)', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await bootPayload([fontsPlugin({ optimize: { charset: 'latin' }, fontFileOptions: { upload: { staticDir: FONT_DIR } } })])
  })
  afterAll(async () => {
    await teardown(payload)
    for (const dir of [FONT_DIR, ORIGINAL_DIR]) fs.rmSync(dir, { recursive: true, force: true })
  })

  it('registers the fontOriginal archival collection when optimization is on', () => {
    expect(payload.collections.fontOriginal).toBeDefined()
  })

  it('converts an uploaded weight file to WOFF2, archives the original, and reports the size', async () => {
    const created = (await payload.create({
      collection: 'fontFile',
      overrideAccess: true,
      data: { weight: '400', style: 'normal' },
      file: { data: fixture, name: 'Inter-Regular.woff2', mimetype: 'font/woff2', size: fixture.byteLength },
    } as Parameters<typeof payload.create>[0])) as Record<string, unknown>

    // Primary stored file is the optimized WOFF2.
    expect(created.mimeType).toBe('font/woff2')
    expect(String(created.filename).endsWith('.woff2')).toBe(true)

    // Size report fields populated.
    expect(typeof created.optimized).toBe('string')
    expect(created.originalFilesize).toBe(fixture.byteLength)
    expect(created.optimizedFilesize).toBe(created.filesize)
    expect(typeof created.savedPercent).toBe('number')

    // Original archived and linked.
    const original = created.original as { id?: string | number } | string | number | null
    const originalId = original && typeof original === 'object' ? original.id : original
    expect(originalId).toBeTruthy()
    const archived = await payload.findByID({ collection: 'fontOriginal' as never, id: originalId as string, overrideAccess: true })
    expect(archived).toBeTruthy()
    expect((archived as Record<string, unknown>).filesize).toBe(fixture.byteLength)
  })

  it('accepts a weight file the browser typed as application/octet-stream', async () => {
    // The archive mime is derived from the extension, so an octet-stream upload
    // still passes the mime whitelist on both `fontFile` and `fontOriginal`.
    const created = (await payload.create({
      collection: 'fontFile',
      overrideAccess: true,
      data: { weight: '700', style: 'normal' },
      file: { data: fixture, name: 'Octet-Test.otf', mimetype: 'application/octet-stream', size: fixture.byteLength },
    } as Parameters<typeof payload.create>[0])) as Record<string, unknown>

    expect(created.mimeType).toBe('font/woff2')
    expect(created.original).toBeTruthy()
  })

  it('creates optimized fontFiles from staged uploads when the typeface is saved', async () => {
    const created = (await payload.create({
      collection: 'font',
      overrideAccess: true,
      depth: 1,
      data: {
        title: 'Staged',
        family: 'display',
        pendingUploads: [{ data: fixture.toString('base64'), name: 'staged.woff2', mimetype: 'font/woff2', weight: '400', style: 'normal' }],
      },
    } as Parameters<typeof payload.create>[0])) as Record<string, unknown>

    // The staged file became an optimized fontFile linked from `files`.
    const files = (created.files as Array<Record<string, unknown>>) ?? []
    expect(files).toHaveLength(1)
    expect(files[0]?.mimeType).toBe('font/woff2')
    expect(files[0]?.original).toBeTruthy()
    // The base64 payload is not persisted.
    expect(created.pendingUploads).toEqual([])
  })

  it('rejects a staged file whose name is not a recognized font extension (client mime is untrusted)', async () => {
    await expect(
      payload.create({
        collection: 'font',
        overrideAccess: true,
        data: {
          title: 'Bad',
          family: 'sans',
          // Claims font/woff2 but the name says otherwise — the server derives the
          // mime from the name, so this must be rejected, not stored.
          pendingUploads: [{ data: fixture.toString('base64'), name: 'evil.exe', mimetype: 'font/woff2', weight: '400', style: 'normal' }],
        },
      } as Parameters<typeof payload.create>[0]),
    ).rejects.toThrow(/supported font file/i)
  })
})
