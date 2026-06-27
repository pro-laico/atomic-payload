import { describe, expect, it } from 'vitest'

import { SSRProps } from './SSRProps'

// Minimal ImageChild block shapes; the real type is the generated union member.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const imageBlock = (overrides: Record<string, unknown> = {}): any => ({
  blockType: 'ImageChild',
  image: { id: 'img1', width: 1600, height: 900, alt: 'media alt' },
  ...overrides,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const propsFor = async (block: any): Promise<Record<string, unknown>> => ((await SSRProps(block)).c?.p ?? {}) as Record<string, unknown>

describe('SSRProps · ImageChild', () => {
  it('maps the block + image to ResponsiveImage props (no next/image src/version)', async () => {
    const p = await propsFor(imageBlock({ alt: 'override', aspectRatio: '16:9', fit: 'cover', quality: 80, priority: true, blur: true }))
    expect(p.alt).toBe('override')
    expect(p.aspectRatio).toBe('16:9')
    expect(p.fit).toBe('cover')
    expect(p.quality).toBe(80)
    expect(p.priority).toBe(true)
    expect(p.blur).toBe(true) // component derives the placeholder from the smallest variant
    expect('src' in p).toBe(false)
    expect('version' in p).toBe(false)
    expect('fill' in p).toBe(false)
  })

  it('falls back to the media alt and a default responsive sizes string', async () => {
    const p = await propsFor(imageBlock())
    expect(p.alt).toBe('media alt')
    expect(typeof p.sizes).toBe('string')
    expect(p.sizes).toContain('max-width')
  })

  it('honors an explicit sizes string and lazy loading', async () => {
    const p = await propsFor(imageBlock({ size: '(max-width: 768px) 100vw, 50vw', loading: 'lazy' }))
    expect(p.sizes).toBe('(max-width: 768px) 100vw, 50vw')
    expect(p.loading).toBe('lazy')
    expect(p.priority).toBeUndefined()
  })

  it('no-ops for a string (unpopulated) image', async () => {
    const p = await propsFor(imageBlock({ image: 'img1' }))
    expect(p.alt).toBeUndefined()
  })
})
