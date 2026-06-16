import { describe, expect, it } from 'vitest'

import type { ParsedParams } from '../transform/params'
import { variantCacheKey } from './key'

const doc = { id: '665', filename: 'photo-665.jpg', focalX: 40, focalY: 60 }
const p: ParsedParams = { w: 1280, h: 720, fit: 'cover', q: 75, fmt: 'auto' }

describe('variantCacheKey', () => {
  it('is deterministic for identical inputs', () => {
    expect(variantCacheKey(doc, p, 'webp')).toBe(variantCacheKey(doc, p, 'webp'))
  })

  it('changes when any cache-relevant input changes', () => {
    const base = variantCacheKey(doc, p, 'webp')
    expect(variantCacheKey({ ...doc, focalX: 41 }, p, 'webp')).not.toBe(base)
    expect(variantCacheKey({ ...doc, filename: 'photo-665-1.jpg' }, p, 'webp')).not.toBe(base)
    expect(variantCacheKey({ ...doc, id: '666' }, p, 'webp')).not.toBe(base)
    expect(variantCacheKey(doc, { ...p, w: 640 }, 'webp')).not.toBe(base)
    expect(variantCacheKey(doc, { ...p, fit: 'contain' }, 'webp')).not.toBe(base)
    expect(variantCacheKey(doc, p, 'avif')).not.toBe(base)
  })

  it('is stable across a metadata-only edit (key tracks filename, not updatedAt)', () => {
    // Two reads of the same file differing only in fields the key ignores (e.g. a
    // later `updatedAt` from an alt edit) must yield the SAME key, so the stored
    // variant stays reachable instead of being orphaned.
    expect(variantCacheKey({ id: '665', filename: 'photo-665.jpg' }, p, 'webp')).toBe(
      variantCacheKey({ id: '665', filename: 'photo-665.jpg', focalX: 50, focalY: 50 }, { ...p }, 'webp'),
    )
  })

  it('ignores quality for png (lossless) but keeps it for lossy formats', () => {
    const q70 = { ...p, q: 70 }
    const q80 = { ...p, q: 80 }
    expect(variantCacheKey(doc, q70, 'png')).toBe(variantCacheKey(doc, q80, 'png'))
    expect(variantCacheKey(doc, q70, 'webp')).not.toBe(variantCacheKey(doc, q80, 'webp'))
  })

  it('produces a short hex key', () => {
    expect(variantCacheKey(doc, p, 'webp')).toMatch(/^[a-f0-9]{24}$/)
  })
})
