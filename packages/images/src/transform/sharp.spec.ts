import sharp from 'sharp'
import { describe, expect, it } from 'vitest'

import { coverCropGeometry, fitWithinSource, transformImage } from './sharp'

describe('coverCropGeometry', () => {
  it('centers the crop on a centered focal point', () => {
    const g = coverCropGeometry(1000, 500, 400, 400, 50, 50)
    expect(g).toEqual({ resizeWidth: 800, resizeHeight: 400, left: 200, top: 0, width: 400, height: 400 })
  })
  it('clamps the window at the focal extremes', () => {
    const topLeft = coverCropGeometry(1000, 500, 400, 400, 0, 0)
    expect(topLeft.left).toBe(0)
    expect(topLeft.top).toBe(0)
    const bottomRight = coverCropGeometry(1000, 500, 400, 400, 100, 100)
    expect(bottomRight.left).toBe(400) // resizeWidth(800) - width(400)
    expect(bottomRight.top).toBe(0) // resizeHeight equals target height → no vertical room
  })
  it('derives the missing target side from the source aspect ratio', () => {
    const g = coverCropGeometry(1000, 500, 400, undefined, 50, 50)
    expect(g.width).toBe(400)
    expect(g.height).toBe(200)
    expect(g.left).toBe(0)
    expect(g.top).toBe(0)
  })
})

describe('fitWithinSource', () => {
  it('leaves a target that already fits untouched', () => {
    expect(fitWithinSource(600, 400, 1200, 800)).toEqual({ w: 600, h: 400 })
  })
  it('shrinks an oversized target to the source, preserving aspect', () => {
    // 2000×2000 square requested from a 1200×800 source → capped by the short side.
    expect(fitWithinSource(2000, 2000, 1200, 800)).toEqual({ w: 800, h: 800 })
  })
  it('caps each side independently when only one overflows', () => {
    expect(fitWithinSource(2400, 800, 1200, 800)).toEqual({ w: 1200, h: 400 })
  })
})

const makeImage = (w: number, h: number) =>
  sharp({ create: { width: w, height: h, channels: 3, background: { r: 10, g: 120, b: 200 } } })
    .png()
    .toBuffer()

describe('transformImage', () => {
  it('cover-crops to the exact target dimensions and requested format', async () => {
    const src = await makeImage(1200, 800)
    const out = await transformImage(src, { w: 600, h: 600, fit: 'cover', quality: 80, format: 'webp', focalX: 50, focalY: 50 })
    expect(out.width).toBe(600)
    expect(out.height).toBe(600)
    expect(out.mimeType).toBe('image/webp')
    const meta = await sharp(out.data).metadata()
    expect(meta.format).toBe('webp')
    expect(meta.width).toBe(600)
    expect(meta.height).toBe(600)
  })

  it('resizes preserving aspect for non-cover fits (width only)', async () => {
    const src = await makeImage(1200, 800)
    const out = await transformImage(src, { w: 600, fit: 'inside', quality: 75, format: 'jpeg' })
    expect(out.width).toBe(600)
    expect(out.height).toBe(400)
    const meta = await sharp(out.data).metadata()
    expect(meta.format).toBe('jpeg')
  })

  it('emits avif when requested', async () => {
    const src = await makeImage(800, 800)
    const out = await transformImage(src, { w: 200, h: 200, fit: 'cover', quality: 50, format: 'avif' })
    const meta = await sharp(out.data).metadata()
    expect(meta.format).toBe('heif') // sharp reports AVIF containers as 'heif'
    expect(out.width).toBe(200)
  })

  it('never upscales a cover crop beyond the source (preserving aspect)', async () => {
    const src = await makeImage(1200, 800)
    // Request a 2000×2000 square from a 1200×800 source → clamps to 800×800.
    const out = await transformImage(src, { w: 2000, h: 2000, fit: 'cover', quality: 80, format: 'webp' })
    expect(out.width).toBe(800)
    expect(out.height).toBe(800)
  })

  it('never upscales a non-cover fit beyond the source', async () => {
    const src = await makeImage(1200, 800)
    const out = await transformImage(src, { w: 4000, fit: 'inside', quality: 75, format: 'jpeg' })
    expect(out.width).toBe(1200)
    expect(out.height).toBe(800)
  })

  it('honors EXIF orientation (uses the rotated/display dimensions)', async () => {
    // Stored landscape 1200×800 tagged orientation 6 → displays as 800×1200 (portrait).
    const oriented = await sharp({ create: { width: 1200, height: 800, channels: 3, background: { r: 60, g: 60, b: 60 } } })
      .withMetadata({ orientation: 6 })
      .jpeg()
      .toBuffer()
    const out = await transformImage(oriented, { w: 400, fit: 'inside', quality: 80, format: 'jpeg' })
    // inside-fit width 400 on the 800×1200 display → 400×600. If orientation were
    // ignored (treated as 1200×800), it would be 400×267.
    expect(out.width).toBe(400)
    expect(out.height).toBe(600)
  })

  it('rejects when the input is not a decodable image (the endpoint maps this to 500)', async () => {
    await expect(
      transformImage(Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), { w: 100, fit: 'inside', quality: 75, format: 'jpeg' }),
    ).rejects.toThrow()
  })

  it('keeps the focal region in frame when cover-cropping off-center', async () => {
    // A 900×300 source in three vertical bands: red | green | blue.
    const W = 900
    const H = 300
    const raw = Buffer.alloc(W * H * 3)
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 3
        const band = x < 300 ? [255, 0, 0] : x < 600 ? [0, 255, 0] : [0, 0, 255]
        raw[i] = band[0]
        raw[i + 1] = band[1]
        raw[i + 2] = band[2]
      }
    }
    const src = await sharp(raw, { raw: { width: W, height: H, channels: 3 } })
      .png()
      .toBuffer()

    // Average color of the output, as [r,g,b].
    const avg = async (buf: Buffer): Promise<[number, number, number]> => {
      const px = await sharp(buf).resize(1, 1, { fit: 'fill' }).raw().toBuffer()
      return [px[0], px[1], px[2]]
    }

    // Tall 100×300 crop: only one band fits → the focal point picks which.
    const right = await transformImage(src, { w: 100, h: 300, fit: 'cover', quality: 100, format: 'png', focalX: 83, focalY: 50 })
    const [rr, rg, rb] = await avg(right.data)
    expect(rb).toBeGreaterThan(rr)
    expect(rb).toBeGreaterThan(rg) // blue band survived

    const left = await transformImage(src, { w: 100, h: 300, fit: 'cover', quality: 100, format: 'png', focalX: 17, focalY: 50 })
    const [lr, lg, lb] = await avg(left.data)
    expect(lr).toBeGreaterThan(lg)
    expect(lr).toBeGreaterThan(lb) // red band survived
  })
})
