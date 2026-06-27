import { describe, expect, it } from 'vitest'

import {
  bucketQuality,
  clampInt,
  DEFAULT_CONSTRAINTS,
  extForFormat,
  negotiateFormat,
  parseAspectRatio,
  parseTransformParams,
  type TransformConstraints,
} from './params'

const C: TransformConstraints = DEFAULT_CONSTRAINTS

describe('parseAspectRatio', () => {
  it('parses colon, slash, and decimal forms', () => {
    expect(parseAspectRatio('16:9')).toBeCloseTo(16 / 9)
    expect(parseAspectRatio('16/9')).toBeCloseTo(16 / 9)
    expect(parseAspectRatio('1.5')).toBe(1.5)
    expect(parseAspectRatio(1.5)).toBe(1.5)
  })
  it('rejects invalid / non-positive', () => {
    expect(parseAspectRatio('0:1')).toBeUndefined()
    expect(parseAspectRatio('abc')).toBeUndefined()
    expect(parseAspectRatio(undefined)).toBeUndefined()
    expect(parseAspectRatio(-2)).toBeUndefined()
  })
})

describe('clampInt', () => {
  it('clamps and rounds', () => {
    expect(clampInt(5, 40, 95)).toBe(40)
    expect(clampInt(200, 40, 95)).toBe(95)
    expect(clampInt(74.6, 40, 95)).toBe(75)
  })
})

describe('bucketQuality', () => {
  it('snaps to the nearest multiple of 5, then clamps to the range', () => {
    expect(bucketQuality(73, [40, 95])).toBe(75)
    expect(bucketQuality(72, [40, 95])).toBe(70)
    expect(bucketQuality(77, [40, 95])).toBe(75)
    expect(bucketQuality(5, [40, 95])).toBe(40) // snaps to 5, clamps up to the floor
    expect(bucketQuality(200, [40, 95])).toBe(95) // snaps to 200, clamps to the ceiling
  })
})

describe('negotiateFormat', () => {
  it('defaults to webp (not avif) even when the browser accepts avif', () => {
    expect(negotiateFormat('image/avif,image/webp,*/*')).toBe('webp')
    expect(negotiateFormat('image/webp,*/*')).toBe('webp')
    expect(negotiateFormat('text/html')).toBe('jpeg')
    expect(negotiateFormat('')).toBe('jpeg')
    expect(negotiateFormat(null)).toBe('jpeg')
  })

  it('prefers avif when preferAvif is set and the browser accepts it', () => {
    expect(negotiateFormat('image/avif,image/webp,*/*', undefined, true)).toBe('avif')
    // No avif in Accept → still webp even with preferAvif on.
    expect(negotiateFormat('image/webp,*/*', undefined, true)).toBe('webp')
  })

  it('never returns a format outside the configured allowlist', () => {
    // Browser advertises avif/webp, but the consumer only permits jpeg/png.
    const allowed: ('auto' | 'jpeg' | 'png')[] = ['auto', 'jpeg', 'png']
    expect(negotiateFormat('image/avif,image/webp,*/*', allowed)).toBe('jpeg')
    expect(negotiateFormat('image/webp,*/*', allowed)).toBe('jpeg')
    // avif allowed but not webp, preferAvif on → avif when advertised, else fall through.
    expect(negotiateFormat('image/avif,image/webp', ['auto', 'avif', 'png'], true)).toBe('avif')
    expect(negotiateFormat('image/webp', ['auto', 'avif', 'png'])).toBe('png')
  })
})

describe('extForFormat', () => {
  it('maps jpeg to jpg, others passthrough', () => {
    expect(extForFormat('jpeg')).toBe('jpg')
    expect(extForFormat('webp')).toBe('webp')
    expect(extForFormat('avif')).toBe('avif')
    expect(extForFormat('png')).toBe('png')
  })
})

describe('parseTransformParams', () => {
  it('requires at least one dimension', () => {
    const r = parseTransformParams({}, C)
    expect(r.ok).toBe(false)
  })
  it('snaps width (and the ar-derived height) to the dimension grid', () => {
    const r = parseTransformParams({ w: '730', ar: '16:9' }, C)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.params.w).toBe(750) // 730 → nearest multiple of 50
      expect(r.params.h).toBe(400) // round(730 / (16/9)) = 411 → nearest 50
      expect(r.params.fit).toBe('cover')
    }
  })

  it('snaps an explicit width + height to the grid so the variant space stays finite', () => {
    const r = parseTransformParams({ w: '600', h: '730' }, C)
    expect(r.ok && r.params.w).toBe(600) // already on-grid
    expect(r.ok && r.params.h).toBe(750) // 730 → nearest 50
  })

  it('honors exact dimensions when snapping is disabled (dimensionStep <= 1)', () => {
    const r = parseTransformParams({ w: '730', h: '411' }, { ...C, dimensionStep: 1 })
    expect(r.ok && r.params.w).toBe(730)
    expect(r.ok && r.params.h).toBe(411)
  })
  it('buckets + clamps quality and rejects bad dims', () => {
    const lo = parseTransformParams({ w: '640', q: '5' }, C)
    const hi = parseTransformParams({ w: '640', q: '200' }, C)
    const bucketed = parseTransformParams({ w: '640', q: '73' }, C)
    expect(lo.ok && lo.params.q).toBe(40)
    expect(hi.ok && hi.params.q).toBe(95)
    expect(bucketed.ok && bucketed.params.q).toBe(75) // 73 snaps to the nearest 5
    expect(parseTransformParams({ w: '-5' }, C).ok).toBe(false)
  })
  it('clamps an explicit height to maxDimension', () => {
    const r = parseTransformParams({ h: '99999' }, C)
    expect(r.ok && r.params.h).toBe(C.maxDimension)
  })
  it('falls back on unknown fit / format', () => {
    const r = parseTransformParams({ w: '640', fit: 'bogus', fmt: 'tiff' }, C)
    expect(r.ok && r.params.fit).toBe('cover')
    expect(r.ok && r.params.fmt).toBe('auto')
  })
  it('accepts a valid fit and format', () => {
    const r = parseTransformParams({ w: '640', fit: 'contain', fmt: 'webp' }, C)
    expect(r.ok && r.params.fit).toBe('contain')
    expect(r.ok && r.params.fmt).toBe('webp')
  })
})
