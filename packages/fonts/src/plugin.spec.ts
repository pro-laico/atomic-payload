import type { Config } from 'payload'
import { describe, expect, it } from 'vitest'

import { fontsPlugin } from './plugin'

// The uploader stages each weight file as base64 in the multipart `_payload`
// field; busboy caps a non-file field at 1 MB by default and truncates it. The
// plugin raises that cap so several fonts fit in one save. These pure-config tests
// guard that behavior — the integration suites drive the local API and so bypass
// busboy entirely, meaning nothing else would catch a regression here.
describe('fontsPlugin upload.limits.fieldSize (unit)', () => {
  // fontsPlugin is synchronous; the Plugin signature is Config | Promise<Config>.
  const apply = (plugin: ReturnType<typeof fontsPlugin>, config: Partial<Config> = {}): Config => plugin(config as Config) as Config

  it('raises the multipart field-size cap to at least 8 MB when the uploader is on (the default)', () => {
    const out = apply(fontsPlugin())
    expect(out.upload?.limits?.fieldSize).toBeGreaterThanOrEqual(8 * 1024 * 1024)
  })

  it('leaves upload config untouched when the uploader is off', () => {
    const out = apply(fontsPlugin({ uploader: false }))
    expect(out.upload).toBeUndefined()
  })

  it('preserves a higher consumer-set fieldSize (only ever raises)', () => {
    const big = 99 * 1024 * 1024
    const out = apply(fontsPlugin(), { upload: { limits: { fieldSize: big } } })
    expect(out.upload?.limits?.fieldSize).toBe(big)
  })

  it('keeps other upload options while adding the limit', () => {
    const out = apply(fontsPlugin(), { upload: { useTempFiles: true } })
    expect(out.upload?.useTempFiles).toBe(true)
    expect(out.upload?.limits?.fieldSize).toBeGreaterThanOrEqual(8 * 1024 * 1024)
  })

  it('is a no-op when disabled', () => {
    const config = { upload: { limits: { fieldSize: 123 } } } as Config
    expect(fontsPlugin({ enabled: false })(config)).toBe(config)
  })

  it('registers the font + fontFile collections', () => {
    const slugs = (apply(fontsPlugin()).collections ?? []).map((c) => c.slug)
    expect(slugs).toContain('font')
    expect(slugs).toContain('fontFile')
  })
})
