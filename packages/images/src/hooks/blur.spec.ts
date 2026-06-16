import sharp from 'sharp'
import { describe, expect, it, vi } from 'vitest'

import { generateBlurDataUrl, renderBlurDataUrl } from './blur'

const makeImage = (w: number, h: number) =>
  sharp({ create: { width: w, height: h, channels: 3, background: { r: 10, g: 120, b: 200 } } })
    .png()
    .toBuffer()

describe('renderBlurDataUrl', () => {
  it('produces a tiny base64 WebP data URL', async () => {
    const src = await makeImage(1200, 800)
    const url = await renderBlurDataUrl(src)
    expect(url.startsWith('data:image/webp;base64,')).toBe(true)
    const buf = Buffer.from(url.split(',')[1], 'base64')
    const meta = await sharp(buf).metadata()
    expect(meta.format).toBe('webp')
    expect(meta.width).toBe(32) // default width
    expect(meta.height).toBe(21) // 'auto' preserves the 3:2 aspect ratio
  })

  it('honors width / height overrides', async () => {
    const src = await makeImage(1200, 800)
    const meta = await sharp(Buffer.from((await renderBlurDataUrl(src, { width: 16, height: 16 })).split(',')[1], 'base64')).metadata()
    expect(meta.width).toBe(16)
    expect(meta.height).toBe(16)
  })

  it('never enlarges a source smaller than the requested width', async () => {
    const src = await makeImage(10, 10)
    const meta = await sharp(Buffer.from((await renderBlurDataUrl(src, { width: 32 })).split(',')[1], 'base64')).metadata()
    expect(meta.width).toBe(10)
  })
})

describe('generateBlurDataUrl hook', () => {
  it('leaves data untouched when no file is present (metadata-only edit)', async () => {
    const hook = generateBlurDataUrl()
    const data = { alt: 'x' }
    const out = await hook({ data, req: { file: undefined } } as never)
    expect(out).toBe(data)
  })

  it('populates blurDataUrl from the uploaded bytes', async () => {
    const hook = generateBlurDataUrl()
    const file = { data: await makeImage(400, 400) }
    const out = (await hook({ data: { alt: 'x' }, req: { file } } as never)) as { blurDataUrl?: string }
    expect(out.blurDataUrl?.startsWith('data:image/webp;base64,')).toBe(true)
  })

  it('is best-effort: a Sharp failure logs and returns the original data', async () => {
    const hook = generateBlurDataUrl()
    const warn = vi.fn()
    const data = { alt: 'x' }
    const out = await hook({ data, req: { file: { data: Buffer.from([0, 1, 2, 3]) }, payload: { logger: { warn } } } } as never)
    expect(out).toBe(data)
    expect(warn).toHaveBeenCalledOnce()
  })
})
