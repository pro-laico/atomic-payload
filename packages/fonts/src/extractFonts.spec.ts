import { describe, expect, it } from 'vitest'

import { extractFonts } from './extractFonts'

describe('extractFonts', () => {
  it('joins the next/font/local variable classes with a space', () => {
    expect(extractFonts({ sans: { variable: 'font-a' }, serif: { variable: 'font-b' } })).toBe('font-a font-b')
  })

  it('skips undefined slots and missing variables', () => {
    expect(extractFonts({ sans: undefined, serif: { variable: 'font-x' }, mono: { variable: undefined } })).toBe('font-x')
  })

  it('returns undefined when nothing has been generated yet', () => {
    expect(extractFonts({})).toBeUndefined()
  })
})
