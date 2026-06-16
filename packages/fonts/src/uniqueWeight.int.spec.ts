import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { bootPayload, teardown } from '@tools/test-helpers'
import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { fontsPlugin } from './plugin'

const FONT_DIR = path.join(os.tmpdir(), 'ap-fonts-unique-test')
const fixture = fs.readFileSync(fileURLToPath(new URL('./__fixtures__/inter.woff2', import.meta.url)))

describe('fontsPlugin unique weight guard (integration)', () => {
  let payload: Payload

  beforeAll(async () => {
    // Optimize off — the weight files are stored as-is; the within-typeface
    // uniqueness guard on `font` is always wired.
    payload = await bootPayload([fontsPlugin({ fontFileOptions: { upload: { staticDir: FONT_DIR } } })])
  })
  afterAll(async () => {
    await teardown(payload)
    fs.rmSync(FONT_DIR, { recursive: true, force: true })
  })

  const createFile = async (weight: string, style: 'normal' | 'italic', name: string): Promise<string | number> => {
    const doc = (await payload.create({
      collection: 'fontFile',
      overrideAccess: true,
      data: { weight, style },
      file: { data: fixture, name, mimetype: 'font/woff2', size: fixture.byteLength },
    } as Parameters<typeof payload.create>[0])) as { id: string | number }
    return doc.id
  }
  const createTypeface = (title: string, files: Array<string | number>) =>
    payload.create({ collection: 'font', overrideAccess: true, data: { title, family: 'sans', files } } as Parameters<typeof payload.create>[0])

  it('allows a typeface with distinct weight/style files', async () => {
    const a = await createFile('400', 'normal', 'a.woff2')
    const b = await createFile('700', 'normal', 'b.woff2')
    const tf = (await createTypeface('Distinct', [a, b])) as { id: string | number }
    expect(tf.id).toBeTruthy()
  })

  it('rejects a typeface with two files at the same weight + style', async () => {
    const a = await createFile('900', 'italic', 'c.woff2')
    const b = await createFile('900', 'italic', 'd.woff2')
    await expect(createTypeface('Dupe', [a, b])).rejects.toThrow()
  })

  it('rejects a typeface with no files', async () => {
    await expect(
      payload.create({ collection: 'font', overrideAccess: true, data: { title: 'Empty', family: 'sans' } } as Parameters<typeof payload.create>[0]),
    ).rejects.toThrow(/at least one/i)
  })
})
