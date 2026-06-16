/**
 * Pure, isomorphic URL builders for the on-demand transform endpoint. NO Node /
 * Sharp / server imports — safe to bundle into client components. Produces
 * same-origin relative URLs by default (the user's preference); pass `baseUrl` for
 * absolute contexts (OG tags, emails).
 */
import { DEFAULT_PIXEL_STEP, parseAspectRatio, type Fit, type Format } from '../transform/params'

export { DEFAULT_PIXEL_STEP }

/**
 * Default base for transform URLs: `/api` + the plugin's default `/img` endpoint path.
 * If you set `imagesPlugin`'s `transform.path`, pass the matching `path` here (and to
 * `<ResponsiveImage path>`) or every generated URL 404s.
 */
export const DEFAULT_TRANSFORM_API_PATH = '/api/img'

export interface BuildUrlOptions {
  fit?: Fit
  quality?: number
  format?: Format
  /** Render aspect ratio (`16/9` | `"16:9"`); derives `h` from each width. */
  aspectRatio?: number | string
  /** Prefix for absolute URLs (e.g. `https://site.com`). Default '' (same-origin). */
  baseUrl?: string
  /** Endpoint base path. Default `/api/img` ({@link DEFAULT_TRANSFORM_API_PATH}). */
  path?: string
  /**
   * Cache-busting version token appended as `v=`. Derive it from the source doc with
   * {@link deriveVersion} so replacing the file or moving the focal point yields a new
   * URL — busting immutable browser/CDN caches (the server ignores `v`, reading focal
   * from the doc; it exists only to make the immutable URL honest).
   */
  version?: string
}

/** Source-identity fields that determine the rendered pixels (independent of size/quality). */
export interface VersionSource {
  filename?: string | null
  focalX?: number | null
  focalY?: number | null
}

// FNV-1a (32-bit) → base36. NOT cryptographic — a compact, stable cache-buster token.
const fnv1a = (s: string): string => {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(36)
}

/**
 * A short, stable version token from the source-identity fields that change the
 * rendered pixels (filename + focal point) — the same inputs the server folds into
 * the variant cache key. Returns undefined when no identity is available (a bare id),
 * in which case URLs carry no `v` — so pass a populated doc to get cache-correct
 * busting on file replace / focal edits.
 */
export const deriveVersion = (src?: VersionSource | null): string | undefined => {
  if (!src) return undefined
  const { filename, focalX, focalY } = src
  if (filename == null && focalX == null && focalY == null) return undefined
  return fnv1a(`${filename ?? ''}|${focalX ?? ''}|${focalY ?? ''}`)
}

export const buildVariantUrl = (id: string, width: number, o: BuildUrlOptions = {}): string => {
  const base = o.baseUrl ?? ''
  const apiPath = o.path ?? DEFAULT_TRANSFORM_API_PATH
  const ar = parseAspectRatio(o.aspectRatio)
  const params = new URLSearchParams()
  params.set('w', String(Math.round(width)))
  if (ar) params.set('h', String(Math.round(width / ar)))
  params.set('fit', o.fit ?? 'cover')
  params.set('q', String(o.quality ?? 75))
  params.set('fmt', o.format ?? 'auto')
  // Appended last so it reads as a trailing cache-buster; the server ignores it.
  if (o.version) params.set('v', o.version)
  return `${base}${apiPath}/${encodeURIComponent(id)}?${params.toString()}`
}

/**
 * The widths for a srcset: multiples of `pixelStep` up to the source's intrinsic
 * width (so we never request a larger-than-original image). If that would produce
 * more than `maxEntries`, the effective step is coarsened to keep the srcset short.
 * With no source width, falls back to stepping up to `maxWidth`.
 */
export const stepWidths = (sourceWidth?: number, pixelStep = DEFAULT_PIXEL_STEP, maxWidth = 4096, maxEntries = 16): number[] => {
  const step = pixelStep > 0 ? pixelStep : DEFAULT_PIXEL_STEP
  // Cap at the largest step multiple that doesn't exceed the source width (so we
  // never request a larger-than-original image). With no source width, step to maxWidth.
  const cap = sourceWidth && sourceWidth > 0 ? Math.max(step, Math.floor(sourceWidth / step) * step) : maxWidth
  const top = Math.min(maxWidth, cap)
  let effective = step
  while (Math.ceil(top / effective) > maxEntries) effective += step
  const widths: number[] = []
  for (let w = effective; w < top; w += effective) widths.push(w)
  widths.push(top)
  return widths
}

export interface BuildSrcsetOptions extends BuildUrlOptions {
  /** Width increment for the srcset. Default 50; raise it to emit fewer widths (and so generate fewer variants). */
  pixelStep?: number
  /** The source image's intrinsic width — caps the srcset (no upscaling). */
  sourceWidth?: number
  /** Hard ceiling. Default 4096. */
  maxWidth?: number
  /** Max srcset entries before the step is coarsened. Default 16. */
  maxEntries?: number
  /** Width used for the plain `src` fallback. Defaults to min(top, 1280). */
  defaultWidth?: number
}

export interface BuildSrcsetResult {
  srcset: string
  src: string
}

/** Build a responsive `srcset` (pixelStep multiples up to the source width) + a default `src`. */
export const buildSrcset = (id: string, o: BuildSrcsetOptions = {}): BuildSrcsetResult => {
  const widths = stepWidths(o.sourceWidth, o.pixelStep, o.maxWidth, o.maxEntries)
  const srcset = widths.map((w) => `${buildVariantUrl(id, w, o)} ${w}w`).join(', ')
  const top = widths[widths.length - 1] ?? o.maxWidth ?? 4096
  const src = buildVariantUrl(id, o.defaultWidth ?? Math.min(top, 1280), o)
  return { srcset, src }
}

export type { Fit, Format }
