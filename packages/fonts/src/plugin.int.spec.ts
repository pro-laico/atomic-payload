import { bootPayload, teardown } from '@tools/test-helpers'
import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { fontsPlugin } from './plugin'

describe('fontsPlugin (integration)', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await bootPayload([fontsPlugin({ includeFontSet: true })])
  })
  afterAll(async () => {
    await teardown(payload)
  })

  it('registers the font (typeface) and fontFile collections', () => {
    expect(payload.collections.font).toBeDefined()
    expect(payload.collections.fontFile).toBeDefined()
  })

  it('does NOT register the fontOriginal collection when optimization is off (default)', () => {
    expect(payload.collections.fontOriginal).toBeUndefined()
  })

  it('puts typeface fields on `font` and weight metadata on `fontFile`', () => {
    const fontNames = payload.collections.font.config.fields.map((f) => ('name' in f ? f.name : undefined))
    expect(fontNames).toEqual(expect.arrayContaining(['title', 'family', 'files']))
    const fileNames = payload.collections.fontFile.config.fields.map((f) => ('name' in f ? f.name : undefined))
    expect(fileNames).toEqual(expect.arrayContaining(['weight', 'style']))
  })

  it('registers the fontSet global when includeFontSet is set', () => {
    expect(payload.config.globals.some((g) => g.slug === 'fontSet')).toBe(true)
  })

  it('registers the fonts export endpoint', () => {
    expect(payload.config.endpoints.some((e) => typeof e.path === 'string' && e.path.includes('/fonts/export'))).toBe(true)
  })

  it('round-trips a document via the local API (proves the in-memory DB works)', async () => {
    const created = await payload.create({ collection: 'users', data: { email: 'a@b.com', password: 'password123' } })
    const found = await payload.findByID({ collection: 'users', id: created.id })
    expect(found.id).toBe(created.id)
  })
})
