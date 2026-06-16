/**
 * Pure parsing / validation for the on-demand transform endpoint. No Sharp, no
 * Payload, no Node APIs beyond standard JS — safe to unit test in isolation and
 * (for the URL helpers it shares shapes with) reason about deterministically.
 */

export type Fit = 'cover' | 'contain' | 'inside' | 'outside' | 'fill'
export type Format = 'auto' | 'avif' | 'webp' | 'jpeg' | 'png'
/** A concrete output format (never `auto`). */
export type OutputFormat = Exclude<Format, 'auto'>

export const FITS: Fit[] = ['cover', 'contain', 'inside', 'outside', 'fill']

export interface TransformConstraints {
  /** Hard ceiling on either output dimension. */
  maxDimension: number
  /** [min, max] clamp for quality. */
  qualityRange: [number, number]
  /** Quality used when the request omits `q`. */
  defaultQuality: number
  /** Formats the endpoint may emit. */
  formats: Format[]
  /** Format used when the request omits `fmt`. */
  defaultFormat: Format
}

/**
 * Default srcset width increment. The frontend steps the srcset by this; it's
 * configurable per `<ResponsiveImage>` / `buildSrcset` (raise it to emit fewer
 * widths and so generate fewer variants). The endpoint does NOT snap to it — it
 * honors whatever width the srcset requests.
 */
export const DEFAULT_PIXEL_STEP = 50

export const DEFAULT_CONSTRAINTS: TransformConstraints = {
  maxDimension: 4096,
  qualityRange: [40, 95],
  defaultQuality: 75,
  formats: ['auto', 'avif', 'webp', 'jpeg', 'png'],
  defaultFormat: 'auto',
}

export interface ParsedParams {
  w?: number
  h?: number
  fit: Fit
  q: number
  fmt: Format
}

export const clampInt = (n: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, Math.round(n)))

/**
 * Snap a requested quality to the nearest multiple of 5, then clamp to `[lo, hi]`.
 * Bucketing collapses the otherwise-continuous `q` space to ~a dozen values, bounding
 * how many distinct variants a single (source, size, format) can spawn.
 */
export const bucketQuality = (q: number, [lo, hi]: [number, number]): number => clampInt(Math.round(q / 5) * 5, lo, hi)

/** Parse "16:9" | "16/9" | "1.78" → a number, or undefined when unparseable / non-positive. */
export const parseAspectRatio = (ar: number | string | null | undefined): number | undefined => {
  if (ar == null) return undefined
  if (typeof ar === 'number') return Number.isFinite(ar) && ar > 0 ? ar : undefined
  const s = ar.trim()
  const m = s.match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/)
  if (m) {
    const a = Number(m[1])
    const b = Number(m[2])
    const r = b > 0 ? a / b : 0
    return r > 0 ? r : undefined
  }
  const n = Number(s)
  return Number.isFinite(n) && n > 0 ? n : undefined
}

export const extForFormat = (fmt: OutputFormat): string => (fmt === 'jpeg' ? 'jpg' : fmt)
export const mimeForFormat = (fmt: OutputFormat): string => `image/${fmt}`

/**
 * Negotiate a concrete output format from the `Accept` header when `fmt=auto`,
 * constrained to the configured `allowed` formats (so a consumer who omits avif/webp
 * from `formats` never gets them served), falling back to jpeg → png → whatever's allowed.
 */
export const negotiateFormat = (accept: string | null | undefined, allowed?: Format[]): OutputFormat => {
  const a = accept ?? ''
  const ok = (f: OutputFormat): boolean => !allowed || allowed.includes(f)
  if (a.includes('image/avif') && ok('avif')) return 'avif'
  if (a.includes('image/webp') && ok('webp')) return 'webp'
  if (ok('jpeg')) return 'jpeg'
  if (ok('png')) return 'png'
  if (ok('webp')) return 'webp'
  return ok('avif') ? 'avif' : 'jpeg'
}

export type ParseResult = { ok: true; params: ParsedParams } | { ok: false; error: string }

type QuerySource = URLSearchParams | Record<string, string | null | undefined>

const read = (q: QuerySource, key: string): string | undefined => {
  const v = q instanceof URLSearchParams ? q.get(key) : q[key]
  return v == null ? undefined : String(v)
}
const numeric = (s: string | undefined): number | undefined => {
  if (s == null || s === '') return undefined
  const n = Number(s)
  return Number.isFinite(n) ? n : undefined
}

/**
 * Parse + validate the transform query params. Width snaps to the allowlist; a
 * missing dimension is derived from `ar`; quality clamps to the configured range;
 * unknown `fit`/`fmt` fall back to `cover` / the default format. Requires at least
 * one of width/height.
 */
export const parseTransformParams = (q: QuerySource, c: TransformConstraints): ParseResult => {
  const ar = parseAspectRatio(read(q, 'ar'))

  const wRaw = numeric(read(q, 'w'))
  const hRaw = numeric(read(q, 'h'))
  if (wRaw != null && wRaw <= 0) return { ok: false, error: 'invalid w' }
  if (hRaw != null && hRaw <= 0) return { ok: false, error: 'invalid h' }

  // Honor the requested dimensions exactly (only clamped to `maxDimension`), so the
  // variant's aspect ratio is exactly what the component asked for and the browser
  // never re-crops it on display. The srcset's discrete widths (its configurable
  // `pixelStep`) are what bound how many variants get generated — not server snapping.
  const cap = (n: number): number => clampInt(n, 1, c.maxDimension)
  let w = wRaw != null ? cap(Math.round(wRaw)) : undefined
  let h = hRaw != null ? cap(Math.round(hRaw)) : undefined

  if (ar) {
    // Derive the missing side from the aspect ratio (exact — preserves the ratio).
    if (w != null && h == null) h = cap(Math.round(w / ar))
    else if (h != null && w == null) w = cap(Math.round(h * ar))
  }

  if (w == null && h == null) return { ok: false, error: 'width or height required' }

  const fitRaw = read(q, 'fit')
  const fit: Fit = FITS.includes(fitRaw as Fit) ? (fitRaw as Fit) : 'cover'

  const qRaw = numeric(read(q, 'q'))
  const quality = qRaw == null ? c.defaultQuality : bucketQuality(qRaw, c.qualityRange)

  const fmtRaw = read(q, 'fmt')
  const fmt: Format = c.formats.includes(fmtRaw as Format) ? (fmtRaw as Format) : c.defaultFormat

  return { ok: true, params: { w, h, fit, q: quality, fmt } }
}
