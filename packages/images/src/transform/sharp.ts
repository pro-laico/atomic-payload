/**
 * Server-only Sharp transform. `sharp` is a lazy import so the package carries no
 * hard runtime dependency (it's an optional peer) and so client bundles never pull
 * it in. The focal-crop geometry is split out as a pure function for unit testing.
 */
import type { Sharp } from 'sharp'

import { coverCropGeometry, fitWithinSource } from './geometry'
import { type Fit, mimeForFormat, type OutputFormat } from './params'

// The pure focal-crop geometry now lives in `./geometry` (isomorphic, shared with the
// admin focal preview). Re-exported here so existing importers and tests are unaffected.
export { coverCropGeometry, coverObjectPosition, fitWithinSource } from './geometry'
export type { CropGeometry } from './geometry'

export interface TransformInput {
  w?: number
  h?: number
  fit: Fit
  quality: number
  format: OutputFormat
  focalX?: number | null
  focalY?: number | null
}

export interface TransformOutput {
  data: Buffer
  format: OutputFormat
  width: number
  height: number
  mimeType: string
}

// ~16k². Bounds decode work so a crafted huge image can't OOM the function.
const MAX_INPUT_PIXELS = 16_384 * 16_384

const encode = (pipeline: Sharp, format: OutputFormat, quality: number): Sharp => {
  switch (format) {
    case 'avif':
      return pipeline.avif({ quality })
    case 'webp':
      return pipeline.webp({ quality })
    case 'png':
      return pipeline.png()
    default:
      // jpeg is the default encoder.
      return pipeline.jpeg({ quality, mozjpeg: true })
  }
}

/** Transform a source image buffer: focal cover-crop (or plain resize for other fits) + encode. */
export const transformImage = async (src: Buffer, input: TransformInput): Promise<TransformOutput> => {
  const sharp = (await import('sharp')).default

  // `.rotate()` with no args auto-orients from EXIF; metadata still reports the
  // pre-rotation orientation, so derive the post-orientation source dims here.
  let pipeline = sharp(src, { failOn: 'none', limitInputPixels: MAX_INPUT_PIXELS }).rotate()
  const meta = await pipeline.metadata()
  const swapped = (meta.orientation ?? 1) >= 5
  const sw = (swapped ? meta.height : meta.width) ?? 0
  const sh = (swapped ? meta.width : meta.height) ?? 0

  // Focal cover-crop needs a fixed target BOX (both w and h) to crop into; a
  // single-dimension `cover` request has no second axis to crop along, so it falls to
  // the plain aspect-preserving resize below (focal point doesn't apply there). The
  // endpoint derives the missing side from `ar` when given, so srcset entries (which
  // pass both) always take this focal path.
  if (input.fit === 'cover' && input.w != null && input.h != null && sw > 0 && sh > 0) {
    // Clamp the target box to the source first so cover never upscales (and the
    // requested aspect ratio is preserved).
    const { w: tw, h: th } = fitWithinSource(input.w, input.h, sw, sh)
    const g = coverCropGeometry(sw, sh, tw, th, input.focalX ?? 50, input.focalY ?? 50)
    pipeline = pipeline.resize(g.resizeWidth, g.resizeHeight).extract({ left: g.left, top: g.top, width: g.width, height: g.height })
  } else {
    // `withoutEnlargement` is the same no-upscale guard for the other fits.
    pipeline = pipeline.resize({ width: input.w, height: input.h, fit: input.fit, withoutEnlargement: true })
  }

  const { data, info } = await encode(pipeline, input.format, input.quality).toBuffer({ resolveWithObject: true })
  return { data, format: input.format, width: info.width, height: info.height, mimeType: mimeForFormat(input.format) }
}
