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

  it('registers the font, fontOriginal, and fontOptimized collections', () => {
    expect(payload.collections.font).toBeDefined()
    expect(payload.collections.fontOriginal).toBeDefined()
    expect(payload.collections.fontOptimized).toBeDefined()
  })

  it('puts the typeface slots on `font` and served metadata on `fontOptimized`', () => {
    const fontNames = payload.collections.font.config.fields.map((f) => ('name' in f ? f.name : undefined))
    expect(fontNames).toEqual(expect.arrayContaining(['title', 'family', 'variable', 'weights']))
    const optNames = payload.collections.fontOptimized.config.fields.map((f) => ('name' in f ? f.name : undefined))
    expect(optNames).toEqual(expect.arrayContaining(['font', 'original', 'weight', 'style', 'isVariable']))
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
