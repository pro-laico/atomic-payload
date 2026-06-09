import { describe, expect, it } from 'vitest'

import { extractSvgContent, extractSvgProps } from './extractSVG'

describe('extractSvgContent', () => {
  it('returns the inner markup without the outer <svg> tags', () => {
    expect(extractSvgContent('<svg viewBox="0 0 1 1"><path d="M0 0"/></svg>')).toBe('<path d="M0 0"/>')
  })

  it('lazily matches the first </svg> so a nested svg is not swallowed', () => {
    // Lazy `*?` captures up to the FIRST closing tag, keeping the inner content.
    expect(extractSvgContent('<svg><svg><rect/></svg></svg>')).toContain('<rect/>')
  })

  it('falls back to the original string when there is no <svg>', () => {
    expect(extractSvgContent('plain text')).toBe('plain text')
  })
})

describe('extractSvgProps', () => {
  it('parses namespaced/hyphenated attributes in both quote styles', () => {
    const props = extractSvgProps(`<svg xmlns:xlink='x' fill-rule="evenodd">`)
    expect(props['xmlns:xlink']).toBe('x')
    expect(props['fill-rule']).toBe('evenodd')
  })

  it('returns an empty object when there is no <svg> tag', () => {
    expect(extractSvgProps('nope')).toEqual({})
  })
})
