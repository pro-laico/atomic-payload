import { describe, expect, it } from 'vitest'

import { buildSrcset, buildVariantUrl, deriveVersion, stepWidths } from './buildSrcset'

describe('buildVariantUrl', () => {
  it('bakes settings into a same-origin query URL', () => {
    expect(buildVariantUrl('abc', 640, { fit: 'cover', quality: 80, format: 'webp', aspectRatio: '16:9' })).toBe(
      '/api/img/abc?w=640&h=360&fit=cover&q=80&fmt=webp',
    )
  })
  it('omits height without an aspect ratio and applies defaults', () => {
    expect(buildVariantUrl('abc', 800)).toBe('/api/img/abc?w=800&fit=cover&q=75&fmt=auto')
  })
  it('supports an absolute base and a custom path', () => {
    expect(buildVariantUrl('abc', 320, { baseUrl: 'https://site.com', path: '/api/image' })).toBe(
      'https://site.com/api/image/abc?w=320&fit=cover&q=75&fmt=auto',
    )
  })
  it('encodes the id', () => {
    expect(buildVariantUrl('a/b', 320)).toContain('/api/img/a%2Fb?')
  })
  it('appends a version cache-buster as a trailing v= when given, and omits it otherwise', () => {
    expect(buildVariantUrl('abc', 800, { version: 'xyz9' })).toBe('/api/img/abc?w=800&fit=cover&q=75&fmt=auto&v=xyz9')
    expect(buildVariantUrl('abc', 800)).not.toContain('v=')
  })
})

describe('deriveVersion', () => {
  it('returns undefined without source identity (a bare id → no v)', () => {
    expect(deriveVersion(undefined)).toBeUndefined()
    expect(deriveVersion({})).toBeUndefined()
  })
  it('is stable for the same filename + focal', () => {
    expect(deriveVersion({ filename: 'a.png', focalX: 50, focalY: 50 })).toBe(deriveVersion({ filename: 'a.png', focalX: 50, focalY: 50 }))
  })
  it('changes when the file is replaced or the focal point moves', () => {
    const base = deriveVersion({ filename: 'a.png', focalX: 50, focalY: 50 })
    expect(deriveVersion({ filename: 'b.png', focalX: 50, focalY: 50 })).not.toBe(base) // file replaced
    expect(deriveVersion({ filename: 'a.png', focalX: 80, focalY: 50 })).not.toBe(base) // focal moved
  })
})

describe('stepWidths', () => {
  it('steps by pixelStep up to the source width (the 100px example)', () => {
    expect(stepWidths(100, 50)).toEqual([50, 100])
  })
  it('never exceeds the largest step multiple at or below the source width', () => {
    expect(stepWidths(120, 50)).toEqual([50, 100]) // 120 → cap at 100 (no upscale)
  })
  it('coarsens the step to stay under the entry cap for large sources', () => {
    const w = stepWidths(1600, 50, 4096, 16)
    expect(w.length).toBeLessThanOrEqual(16)
    expect(w[w.length - 1]).toBe(1600)
    expect(w[0]).toBeGreaterThanOrEqual(50)
  })
  it('falls back to stepping up to maxWidth when no source width is given', () => {
    const w = stepWidths(undefined, 50, 200, 16)
    expect(w[w.length - 1]).toBe(200)
    expect(w.every((x) => x % 50 === 0)).toBe(true)
  })
})

describe('buildSrcset', () => {
  it('builds a srcset capped at the source width with a default src', () => {
    const { srcset, src } = buildSrcset('abc', { aspectRatio: '1:1', sourceWidth: 100, pixelStep: 50 })
    expect(srcset).toBe('/api/img/abc?w=50&h=50&fit=cover&q=75&fmt=auto 50w, /api/img/abc?w=100&h=100&fit=cover&q=75&fmt=auto 100w')
    expect(src).toBe('/api/img/abc?w=100&h=100&fit=cover&q=75&fmt=auto')
  })
  it('threads a custom endpoint path into every generated URL', () => {
    const { srcset, src } = buildSrcset('abc', { sourceWidth: 100, pixelStep: 50, path: '/api/image' })
    expect(src.startsWith('/api/image/abc?')).toBe(true)
    for (const entry of srcset.split(', ')) expect(entry.startsWith('/api/image/abc?')).toBe(true)
  })
})
