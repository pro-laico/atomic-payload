import { describe, expect, it } from 'vitest'

import { GenerateMetaData } from './generateMetaData'

describe('GenerateMetaData', () => {
  it('builds an absolute 1200x630 transform URL for a populated OG image', () => {
    const md = GenerateMetaData({ page: { meta: { image: { id: 'abc' } } } })
    expect(typeof md.openGraph?.images).toBe('string')
    expect(md.openGraph?.images).toMatch(/^https?:\/\//)
    expect(md.openGraph?.images).toContain('/api/img/abc?w=1200&h=630&fit=cover&fmt=jpeg')
  })

  it('accepts a bare id string for the OG image (depth 0)', () => {
    const md = GenerateMetaData({ page: { meta: { image: 'xyz' } } })
    expect(md.openGraph?.images).toContain('/api/img/xyz?w=1200&h=630')
  })

  it('falls back to the site OG image when the page has none', () => {
    const md = GenerateMetaData({ siteMetadata: { fallbackOGImage: { id: 'fallback' } } })
    expect(md.openGraph?.images).toContain('/api/img/fallback?')
  })

  it('uses favicon urls as-is without transforming them', () => {
    const md = GenerateMetaData({ page: { meta: { lightFavicon: { url: 'https://cdn.example/x.ico' } } } })
    expect(md.icons).toEqual([{ url: 'https://cdn.example/x.ico' }])
  })

  it('omits the OG image when none is provided', () => {
    const md = GenerateMetaData({ page: { meta: { title: 'x' } } })
    expect(md.openGraph?.images).toBeUndefined()
  })
})
