import type { Config } from 'payload'
import { describe, expect, it } from 'vitest'

import { fontsPlugin } from './plugin'

describe('fontsPlugin (unit)', () => {
  // fontsPlugin is synchronous; the Plugin signature is Config | Promise<Config>.
  const apply = (plugin: ReturnType<typeof fontsPlugin>, config: Partial<Config> = {}): Config => plugin(config as Config) as Config

  it('registers the font, fontOriginal, and fontOptimized collections', () => {
    const slugs = (apply(fontsPlugin()).collections ?? []).map((c) => c.slug)
    expect(slugs).toEqual(expect.arrayContaining(['font', 'fontOriginal', 'fontOptimized']))
  })

  it('registers the fontSet global only when includeFontSet is set', () => {
    expect((apply(fontsPlugin()).globals ?? []).some((g) => g.slug === 'fontSet')).toBe(false)
    expect((apply(fontsPlugin({ includeFontSet: true })).globals ?? []).some((g) => g.slug === 'fontSet')).toBe(true)
  })

  it('leaves upload config untouched (uploads go to the fontOriginal collection)', () => {
    expect(apply(fontsPlugin()).upload).toBeUndefined()
  })

  it('is a no-op when disabled', () => {
    const config = { collections: [] } as unknown as Config
    expect(fontsPlugin({ enabled: false })(config)).toBe(config)
  })
})
