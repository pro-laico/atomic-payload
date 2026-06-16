/**
 * Pure focal-crop geometry — no Sharp, no Node APIs. Isomorphic on purpose: the
 * transform endpoint (server) and the admin focal preview (client) both import it, so
 * what the author sets against the preview is exactly what the endpoint renders.
 */

export const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v))

export interface CropGeometry {
  /** Resize the source to these dims first (preserves aspect, covers the target). */
  resizeWidth: number
  resizeHeight: number
  /** Then extract this window (centered on the focal point, clamped to bounds). */
  left: number
  top: number
  width: number
  height: number
}

/**
 * Cover-crop geometry honoring a focal point. Given the (orientation-corrected)
 * source dims, a target box (one side may be omitted and is derived from the
 * source aspect), and focal percentages (0–100), returns the resize dims and the
 * extract window centered on the focal point.
 */
export const coverCropGeometry = (
  sw: number,
  sh: number,
  targetW: number | undefined,
  targetH: number | undefined,
  focalX = 50,
  focalY = 50,
): CropGeometry => {
  const tw = targetW ?? Math.max(1, Math.round(((targetH as number) * sw) / sh))
  const th = targetH ?? Math.max(1, Math.round(((targetW as number) * sh) / sw))
  const scale = Math.max(tw / sw, th / sh)
  const resizeWidth = Math.max(tw, Math.round(sw * scale))
  const resizeHeight = Math.max(th, Math.round(sh * scale))
  const fx = (clamp(focalX, 0, 100) / 100) * resizeWidth
  const fy = (clamp(focalY, 0, 100) / 100) * resizeHeight
  const left = clamp(Math.round(fx - tw / 2), 0, resizeWidth - tw)
  const top = clamp(Math.round(fy - th / 2), 0, resizeHeight - th)
  return { resizeWidth, resizeHeight, left, top, width: tw, height: th }
}

/**
 * No-upscale clamp: shrink a target box so it fits within the source, preserving the
 * box's aspect ratio. A request larger than the original therefore renders at the
 * source's resolution instead of being enlarged (saves work + storage, and bounds
 * how large a variant can get regardless of the requested dimensions).
 */
export const fitWithinSource = (tw: number, th: number, sw: number, sh: number): { w: number; h: number } => {
  const f = Math.min(1, sw / tw, sh / th)
  return { w: Math.max(1, Math.round(tw * f)), h: Math.max(1, Math.round(th * f)) }
}

/**
 * The CSS `object-position` percentages (x, y) that reproduce {@link coverCropGeometry}
 * for a box of the given aspect ratio. A plain `object-position: <focalX>% <focalY>%`
 * pans *proportionally* (subject lands at focal% of the frame); the endpoint instead
 * centers the focal point in the crop and only drifts near the source edges. This maps
 * a focal point to the equivalent window offset so an `object-fit: cover` preview
 * matches the endpoint exactly. Falls back to centered when an axis isn't cropped.
 */
export const coverObjectPosition = (sw: number, sh: number, ratioW: number, ratioH: number, focalX = 50, focalY = 50): { x: number; y: number } => {
  if (sw <= 0 || sh <= 0 || ratioW <= 0 || ratioH <= 0) return { x: 50, y: 50 }
  // Scale the ratio box up (to integer dims) so the rounded geometry yields
  // sub-percent precision on the cropped axis.
  const k = 1000 / Math.max(ratioW, ratioH)
  const g = coverCropGeometry(sw, sh, Math.round(ratioW * k), Math.round(ratioH * k), focalX, focalY)
  const ox = g.resizeWidth - g.width
  const oy = g.resizeHeight - g.height
  // A cover crop only ever trims one axis; the fitting axis isn't cropped, so its
  // object-position has no visible effect — report it centered.
  return { x: ox >= 1 ? (g.left / ox) * 100 : 50, y: oy >= 1 ? (g.top / oy) * 100 : 50 }
}
