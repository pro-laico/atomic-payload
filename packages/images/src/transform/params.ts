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
  /**
   * Auto-negotiate AVIF when the browser accepts it. Off by default: AVIF encoding is
   * far slower than WebP, so on-demand `fmt=auto` serves WebP for a fast cold path.
   * AVIF stays available on an explicit `fmt=avif`; flip this on to prefer it in `auto`.
   */
  preferAvif: boolean
  /**
   * Snap requested `w`/`h` to a grid of this many px before transforming + caching, so
   * the continuous dimension space collapses to a finite set of buckets. This bounds
   * how many distinct variants a source can ever spawn — an anti-DoS measure (a caller
   * can't force unbounded generation with `w=1,2,3,…`), mirroring Next.js 16's mandatory
   * quality allowlist. Default 50 (the default srcset `pixelStep`, so well-behaved
   * widths pass through unchanged). Set `<= 1` to honor exact dimensions (no snapping).
   */
  dimensionStep: number
  /**
   * Max source pixels (w×h) Sharp will decode — a decompression-bomb guard that also
   * caps per-transform memory (a 100MP image is ~400MB decoded). Default 100,000,000
   * (~100MP). Raise it if you legitimately serve very-high-resolution originals
   * (e.g. 108/200MP phone photos); lower it to harden a public endpoint further.
   */
  maxInputPixels: number
}

/**
 * Default srcset width increment, and the default grid the endpoint snaps requested
 * dimensions to ({@link TransformConstraints.dimensionStep}). The frontend steps the
 * srcset by this; it's configurable per `<ResponsiveImage>` / `buildSrcset` (raise it
 * to emit fewer widths and so generate fewer variants). Because the endpoint snaps to
 * the same grid by default, well-behaved srcset widths pass through unchanged.
 */
export const DEFAULT_PIXEL_STEP = 50

export const DEFAULT_CONSTRAINTS: TransformConstraints = {
  maxDimension: 4096,
  qualityRange: [40, 95],
  defaultQuality: 75,
  formats: ['auto', 'avif', 'webp', 'jpeg', 'png'],
  defaultFormat: 'auto',
  preferAvif: false,
  dimensionStep: DEFAULT_PIXEL_STEP,
  maxInputPixels: 100_000_000,
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

/** The concrete (non-`auto`) formats the plugin can encode/accept, in preference order. */
export const ENCODABLE_FORMATS: OutputFormat[] = ['avif', 'webp', 'jpeg', 'png']

/** Upload mime types accepted by the image collections — derived from {@link ENCODABLE_FORMATS} so they can't drift. */
export const IMAGE_MIME_TYPES: string[] = ENCODABLE_FORMATS.map(mimeForFormat)

/**
 * Negotiate a concrete output format from the `Accept` header when `fmt=auto`,
 * constrained to the configured `allowed` formats (so a consumer who omits avif/webp
 * from `formats` never gets them served). AVIF is only auto-selected when `preferAvif`
 * is set — by default `auto` serves WebP for a fast on-demand path (AVIF stays
 * available on an explicit `fmt=avif`). Falls back jpeg → png → whatever's allowed.
 */
export const negotiateFormat = (accept: string | null | undefined, allowed?: Format[], preferAvif = false): OutputFormat => {
  const a = accept ?? ''
  const ok = (f: OutputFormat): boolean => !allowed || allowed.includes(f)
  if (preferAvif && a.includes('image/avif') && ok('avif')) return 'avif'
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

  const cap = (n: number): number => clampInt(n, 1, c.maxDimension)
  let w = wRaw != null ? cap(Math.round(wRaw)) : undefined
  let h = hRaw != null ? cap(Math.round(hRaw)) : undefined

  if (ar) {
    if (w != null && h == null) h = cap(Math.round(w / ar))
    else if (h != null && w == null) w = cap(Math.round(h * ar))
  }

  if (w == null && h == null) return { ok: false, error: 'width or height required' }

  // Snap to the dimension grid so the variant space stays finite (anti-DoS); `<= 1` disables.
  if (c.dimensionStep > 1) {
    const snap = (n: number | undefined): number | undefined =>
      n == null ? n : clampInt(Math.round(n / c.dimensionStep) * c.dimensionStep, Math.min(c.dimensionStep, c.maxDimension), c.maxDimension)
    w = snap(w)
    h = snap(h)
  }

  const fitRaw = read(q, 'fit')
  const fmtRaw = read(q, 'fmt')
  const qRaw = numeric(read(q, 'q'))
  const quality = qRaw == null ? c.defaultQuality : bucketQuality(qRaw, c.qualityRange)
  const fit: Fit = FITS.includes(fitRaw as Fit) ? (fitRaw as Fit) : 'cover' //TODO: replace `as` cast with proper typing
  const fmt: Format = c.formats.includes(fmtRaw as Format) ? (fmtRaw as Format) : c.defaultFormat //TODO: replace `as` cast with proper typing

  return { ok: true, params: { w, h, fit, q: quality, fmt } }
}
