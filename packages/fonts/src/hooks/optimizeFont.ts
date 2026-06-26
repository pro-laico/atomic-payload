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
  /** Variation axes by tag (variable fonts only); we read `wght` for the weight range. */
  variationAxes?: Record<string, { min: number; default: number; max: number }> | null
  'OS/2'?: { usWeightClass?: number; fsSelection?: number } | null
}

/** subset-font's default export: subset + convert in one call. */
type SubsetFontFn = (buffer: Buffer, text: string, options: { targetFormat: 'woff2' | 'woff' | 'sfnt' }) => Promise<Buffer>

/** Clamp an arbitrary OS/2 weight class to the nearest standard 100–900 step. */
const normalizeWeight = (weight?: number): string | undefined => {
  if (!weight || Number.isNaN(weight)) return undefined
  return String(Math.min(900, Math.max(100, Math.round(weight / 100) * 100)))
}

/**
 * Best-effort read of weight / style / family from a font's metadata via the
 * bundled `fontkit` dependency. Returns `null` when the font can't be parsed.
 *
 * A `wght` variation axis marks a variable font: we keep its full `min max`
 * range (e.g. `'100 900'`) — exactly what `next/font/local` expects — instead of
 * clamping to the single default-instance weight class as we do for static fonts.
 */
export async function detectMetadata(
  buffer: Buffer,
): Promise<{ familyName?: string; weight?: string; style?: 'normal' | 'italic'; isVariable: boolean } | null> {
  try {
    // fontkit v2 ships `create` as a NAMED export under node's ESM interop (no
    // usable `default`), but bundlers may synthesize a default — accept either, or
    // detection silently no-ops and weight/style/family never autofill.
    const mod = (await import('fontkit')) as unknown as { create?: (b: Buffer) => unknown; default?: { create?: (b: Buffer) => unknown } }
    const create = mod.create ?? mod.default?.create
    if (!create) return null
    const font = create(buffer) as FontkitFont
    const italic = Boolean(
      (typeof font.italicAngle === 'number' && font.italicAngle !== 0) ||
        (font['OS/2']?.fsSelection ?? 0) & 0x01 ||
        /italic|oblique/i.test(font.subfamilyName ?? ''),
    )
    const wght = font.variationAxes?.wght
    const weight = wght ? `${Math.round(wght.min)} ${Math.round(wght.max)}` : normalizeWeight(font['OS/2']?.usWeightClass)
    return { familyName: font.familyName ?? undefined, weight, style: italic ? 'italic' : 'normal', isVariable: Boolean(wght) }
  } catch {
    return null
  }
}

/**
 * Subset a font buffer to a WOFF2 using the bundled `subset-font` (harfbuzz).
 * Variable axes are preserved (harfbuzz keeps `fvar`/`gvar` unless axes are
 * explicitly pinned), so a variable font stays variable through the subset.
 */
export async function subsetToWoff2(buffer: Buffer, charsetText: string): Promise<Buffer> {
  const subsetFont = (await import('subset-font')).default as unknown as SubsetFontFn
  return subsetFont(buffer, charsetText, { targetFormat: 'woff2' })
}
