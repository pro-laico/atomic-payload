import type { CollectionAfterDeleteHook, CollectionBeforeOperationHook } from 'payload'

/**
 * Built-in charset presets, expressed as inclusive Unicode code-point ranges.
 * Each preset is expanded to a string of characters that the subsetter keeps;
 * everything else is dropped to shrink the file.
 */
const CHARSET_PRESETS: Record<string, Array<[number, number]>> = {
  // Printable ASCII + Latin-1 Supplement (Western-European accents: é ñ ü ç …)
  // plus the typographic punctuation CMS/word-processor content relies on
  // (curly quotes, en/em dashes, ellipsis, €, ™) so common copy doesn't fall back.
  latin: [
    [0x20, 0x7e],
    [0xa0, 0xff],
    [0x2010, 0x2014],
    [0x2018, 0x201f],
    [0x2022, 0x2022],
    [0x2026, 0x2026],
    [0x20ac, 0x20ac],
    [0x2122, 0x2122],
  ],
  // Everything in `latin` plus Latin Extended-A/B (Central/Eastern-European: ą ž ł ő …).
  'latin-ext': [
    [0x20, 0x7e],
    [0xa0, 0xff],
    [0x100, 0x24f],
    [0x2010, 0x2014],
    [0x2018, 0x201f],
    [0x2022, 0x2022],
    [0x2026, 0x2026],
    [0x20ac, 0x20ac],
    [0x2122, 0x2122],
  ],
}

const rangesToText = (ranges: Array<[number, number]>): string => {
  let text = ''
  for (const [start, end] of ranges) for (let cp = start; cp <= end; cp++) text += String.fromCodePoint(cp)
  return text
}

/**
 * Resolve a charset option to the set of characters the subsetter should keep.
 * A known preset name ('latin' | 'latin-ext') expands to its ranges; any other
 * string is treated as an explicit, verbatim list of characters to retain.
 */
export const resolveCharsetText = (charset = 'latin'): string => {
  const preset = CHARSET_PRESETS[charset]
  return preset ? rangesToText(preset) : charset
}

/** The slice of fontkit's `Font` we read for weight/style/family detection. */
type FontkitFont = {
  familyName?: string | null
  subfamilyName?: string | null
  italicAngle?: number
  'OS/2'?: { usWeightClass?: number; fsSelection?: number } | null
}

/** subset-font's default export: subset + convert in one call. */
type SubsetFontFn = (buffer: Buffer, text: string, options: { targetFormat: 'woff2' | 'woff' | 'sfnt' }) => Promise<Buffer>

/** Clamp an arbitrary OS/2 weight class to the nearest standard 100–900 step. */
const normalizeWeight = (weight?: number): string | undefined => {
  if (!weight || Number.isNaN(weight)) return undefined
  return String(Math.min(900, Math.max(100, Math.round(weight / 100) * 100)))
}

const formatBytes = (n: number): string =>
  n < 1024 ? `${n}B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)}KB` : `${(n / (1024 * 1024)).toFixed(1)}MB`

const EXT_TO_MIME: Record<string, string> = { ttf: 'font/ttf', otf: 'font/otf', woff: 'font/woff', woff2: 'font/woff2' }
const KNOWN_FONT_MIMES = new Set(['font/ttf', 'font/otf', 'font/woff', 'font/woff2', 'font/sfnt'])
/** Trust a real font mime; otherwise derive from the extension — browsers often send `application/octet-stream` for fonts. */
const resolveFontMime = (mime: string | undefined, ext: string): string =>
  mime && KNOWN_FONT_MIMES.has(mime) ? mime : (EXT_TO_MIME[ext] ?? 'font/ttf')

/**
 * Best-effort read of weight / style / family from a font's metadata via the
 * bundled `fontkit` dependency. Returns `null` when the font can't be parsed,
 * so callers fall back to manual fields.
 */
async function detectMetadata(buffer: Buffer): Promise<{ familyName?: string; weight?: string; style?: 'normal' | 'italic' } | null> {
  try {
    const fontkit = (await import('fontkit')).default as unknown as { create: (b: Buffer) => unknown }
    const font = fontkit.create(buffer) as FontkitFont
    const italic = Boolean(
      (typeof font.italicAngle === 'number' && font.italicAngle !== 0) ||
        (font['OS/2']?.fsSelection ?? 0) & 0x01 ||
        /italic|oblique/i.test(font.subfamilyName ?? ''),
    )
    return { familyName: font.familyName ?? undefined, weight: normalizeWeight(font['OS/2']?.usWeightClass), style: italic ? 'italic' : 'normal' }
  } catch {
    return null
  }
}

export interface OptimizeFontHookOptions {
  /** Characters to keep, or a preset name ('latin' | 'latin-ext'). Default 'latin'. */
  charset?: string
  /** Archive the untouched upload to `originalCollectionSlug`. Default true. */
  keepOriginal?: boolean
  /** Slug of the archival upload collection. Default 'fontOriginal'. */
  originalCollectionSlug?: string
}

/**
 * `beforeOperation` hook that converts an uploaded TTF/OTF/WOFF to a subsetted
 * WOFF2 and (optionally) archives the untouched original.
 *
 * It runs on `beforeOperation` — NOT `beforeChange` — deliberately: Payload's
 * `generateFileData` captures the bytes-to-store and derives the filename /
 * mimeType / filesize from `req.file` BETWEEN those two phases. Replacing
 * `req.file` here lets that derivation produce a correct `.woff2` document with
 * zero read-back from storage, so it works the same on local disk and on cloud
 * adapters. (Note: when an adapter uses client-side direct uploads the bytes
 * never reach the server, so `req.file` is absent and this hook no-ops.)
 *
 * Everything is best-effort: any processing error (an unparseable or unsupported
 * font, a WASM load failure) logs a warning and leaves the original upload
 * untouched. `subset-font` + `fontkit` ship as dependencies, so they're present.
 */
export const optimizeFontHook = (opts: OptimizeFontHookOptions = {}): CollectionBeforeOperationHook => {
  const charsetText = resolveCharsetText(opts.charset)
  const keepOriginal = opts.keepOriginal !== false
  const originalCollectionSlug = opts.originalCollectionSlug || 'fontOriginal'

  return async ({ args, operation, req }) => {
    const data = (args as { data?: Record<string, unknown> }).data
    const file = req.file
    // Only act on writes that actually carry file bytes (skips metadata-only
    // edits and client-side direct uploads, where `req.file` is absent/empty).
    if ((operation !== 'create' && operation !== 'update') || !data || !file?.data?.length) return args

    const originalBuffer = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data)
    const originalSize = originalBuffer.length
    const originalName = file.name || (typeof data.filename === 'string' ? data.filename : 'font')
    const baseName = originalName.replace(/\.[^.]+$/, '')
    // Browsers often label fonts `application/octet-stream`; archive under a real
    // font mime (derived from the extension) so the archival collection accepts it.
    const originalMime = resolveFontMime(file.mimetype, (originalName.split('.').pop() || '').toLowerCase())

    try {
      // 1) Auto-detect weight/style/family — fill blanks only, manual entry wins.
      const meta = await detectMetadata(originalBuffer)
      if (meta) {
        if (!data.familyName && meta.familyName) data.familyName = meta.familyName
        if (!data.weight && meta.weight) data.weight = meta.weight
        if (!data.style && meta.style) data.style = meta.style
      }

      // 2) Convert + subset to WOFF2 (throws on a font it can't process → caught below).
      const subsetFont = (await import('subset-font')).default as unknown as SubsetFontFn
      const optimizedBuffer = await subsetFont(originalBuffer, charsetText, { targetFormat: 'woff2' })

      // 3) Archive the untouched original. Pass a SHALLOW-CLONED req: createLocalReq
      // mutates the req it's given and sets `.file` on it, so the clone keeps that
      // mutation off the parent req (preserving our woff2 below) while still sharing
      // `transactionID` so the archive rolls back with the parent on failure.
      if (keepOriginal) {
        const archived = await req.payload.create({
          collection: originalCollectionSlug as never,
          req: { ...req },
          overrideAccess: true,
          data: {} as never,
          file: { data: originalBuffer, name: originalName, mimetype: originalMime, size: originalSize },
        })
        data.original = (archived as { id: string | number }).id
      }

      // 4) Swap the stored primary file to the optimized WOFF2. Build a clean File
      // object (no stale tempFilePath) so generateFileData reads our in-memory buffer.
      req.file = { data: optimizedBuffer, mimetype: 'font/woff2', name: `${baseName}.woff2`, size: optimizedBuffer.length }

      // 5) Size report.
      const optimizedSize = optimizedBuffer.length
      const savedPercent = originalSize > 0 ? Math.round(((originalSize - optimizedSize) / originalSize) * 1000) / 10 : 0
      data.originalFilesize = originalSize
      data.optimizedFilesize = optimizedSize
      data.savedPercent = savedPercent
      data.optimized = `${baseName}: ${formatBytes(originalSize)} → WOFF2 ${formatBytes(optimizedSize)} · ${savedPercent}% smaller`
      req.payload.logger.info(data.optimized)

      return args
    } catch (err) {
      req.payload.logger.warn({ msg: 'Font optimization failed; storing the uploaded file unmodified', err })
      return args
    }
  }
}

/**
 * `afterDelete` hook that removes a font's archived original so it doesn't
 * orphan in storage when the `Font` document is deleted. Best-effort: a failure
 * is logged, not thrown.
 */
export const cleanupOriginalHook = (opts: { originalCollectionSlug?: string } = {}): CollectionAfterDeleteHook => {
  const originalCollectionSlug = opts.originalCollectionSlug || 'fontOriginal'
  return async ({ doc, req }) => {
    const original = (doc as { original?: { id?: string | number } | string | number | null })?.original
    const id = original && typeof original === 'object' ? original.id : original
    if (id) {
      try {
        await req.payload.delete({ collection: originalCollectionSlug as never, id, req, overrideAccess: true })
      } catch (err) {
        req.payload.logger.warn({ msg: 'Could not delete archived font original', err })
      }
    }
    return doc
  }
}

/**
 * `afterDelete` hook for the `Font` (typeface) collection: deletes the weight
 * files it referenced so they don't orphan. Each `fontFile` delete cascades to
 * its own archived original via {@link cleanupOriginalHook}. Best-effort.
 */
export const cleanupFontFilesHook = (opts: { fontFileSlug?: string } = {}): CollectionAfterDeleteHook => {
  const fontFileSlug = opts.fontFileSlug || 'fontFile'
  return async ({ doc, req }) => {
    const files = Array.isArray((doc as { files?: unknown[] })?.files) ? (doc as { files: unknown[] }).files : []
    for (const f of files) {
      const id = f && typeof f === 'object' ? (f as { id?: string | number }).id : (f as string | number)
      if (id == null) continue
      try {
        await req.payload.delete({ collection: fontFileSlug as never, id, req, overrideAccess: true })
      } catch (err) {
        req.payload.logger.warn({ msg: 'Could not delete typeface font file', err })
      }
    }
    return doc
  }
}
