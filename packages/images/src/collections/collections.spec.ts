import type { Field } from 'payload'
import { describe, expect, it } from 'vitest'

import { createGeneratedImagesCollection } from './generatedImages'
import { createImagesCollection } from './images'

const byName = (fields: Field[], name: string) => fields.find((f) => 'name' in f && f.name === name)

describe('createImagesCollection', () => {
  it('is a plain upload: original untouched (no imageSizes, no re-encode), native focal + admin thumbnail', () => {
    const upload = createImagesCollection().upload as {
      imageSizes?: unknown[]
      focalPoint?: boolean
      formatOptions?: unknown
      adminThumbnail?: unknown
    }
    expect(upload).toBeTruthy()
    expect(upload.imageSizes).toBeUndefined()
    expect(upload.focalPoint).toBe(true)
    expect(upload.formatOptions).toBeUndefined() // stored as-uploaded
    expect(upload.adminThumbnail).toBeUndefined() // Payload's default (the original)
  })

  it('restores the legacy 7-size ladder when pregenerateSizes is true', () => {
    const c = createImagesCollection({ pregenerateSizes: true })
    expect((c.upload as { imageSizes?: unknown[] }).imageSizes).toHaveLength(7)
  })

  it('exposes a `variants` join onto the generated-images collection', () => {
    const join = byName(createImagesCollection().fields, 'variants')
    expect(join?.type).toBe('join')
    expect((join as { collection?: string }).collection).toBe('generatedImages')
    expect((join as { on?: string }).on).toBe('source')
  })

  it('adds the blurDataUrl field + a beforeChange hook by default, and drops both when blur is false', () => {
    const on = createImagesCollection()
    expect(byName(on.fields, 'blurDataUrl')).toBeTruthy()
    expect(on.hooks?.beforeChange).toHaveLength(1)
    const off = createImagesCollection({ blur: false })
    expect(byName(off.fields, 'blurDataUrl')).toBeUndefined()
    expect(off.hooks?.beforeChange ?? []).toHaveLength(0)
  })

  it('renders the focal + purge UI fields only when focalUI is on', () => {
    const on = createImagesCollection({ focalUI: true })
    expect(byName(on.fields, 'focalPreview')).toBeTruthy()
    expect(byName(on.fields, 'purgeVariants')).toBeTruthy()
    const off = createImagesCollection({ focalUI: false })
    expect(byName(off.fields, 'focalPreview')).toBeUndefined()
    expect(byName(off.fields, 'purgeVariants')).toBeUndefined()
  })
})

describe('createGeneratedImagesCollection', () => {
  it('is a hidden upload collection keyed by a unique cacheKey', () => {
    const c = createGeneratedImagesCollection()
    expect(c.admin?.hidden).toBe(true)
    expect(c.upload).toBeTruthy()
    const cacheKey = byName(c.fields, 'cacheKey')
    expect(cacheKey?.type).toBe('text')
    expect((cacheKey as { unique?: boolean }).unique).toBe(true)
    const source = byName(c.fields, 'source')
    expect(source?.type).toBe('relationship')
  })

  it('does not redefine the built-in upload width/height fields', () => {
    const c = createGeneratedImagesCollection()
    // width/height come from the upload built-ins; redefining them collides.
    const flat = c.fields.flatMap((f) => ('fields' in f ? (f.fields as Field[]) : [f]))
    expect(byName(flat, 'width')).toBeUndefined()
    expect(byName(flat, 'height')).toBeUndefined()
  })
})
