import type { CollectionConfig } from 'payload'

import { authd } from '../access/authd'

/** Default slug for the archival font-original upload collection. */
export const FONT_ORIGINAL_SLUG = 'fontOriginal'

/**
 * Accepted upload mime types for the four web-font formats. OTF/TTF arrive under
 * several different mime strings depending on the OS/browser, so the whitelist
 * covers the common sfnt variants — otherwise a valid `.otf` can be rejected as
 * "MIME Type invalid". Shared by the `Font` collection and this archival one
 * (which stores the untouched original under its own original mime).
 */
export const FONT_MIME_TYPES = [
  'font/ttf',
  'font/otf',
  'font/woff',
  'font/woff2',
  'font/sfnt',
  'application/font-sfnt',
  'application/vnd.ms-opentype',
  'application/x-font-ttf',
  'application/x-font-otf',
  'application/x-font-truetype',
]

/**
 * Archival upload collection holding the untouched, pre-optimization font files.
 *
 * When `fontsPlugin({ optimize: { keepOriginal: true } })` is enabled, the
 * `optimizeFontHook` stores the original upload here and links it from the
 * served `Font` document's `original` field — so the (lossy, subsetted) WOFF2
 * can be re-derived with a different charset later.
 *
 * It carries NO optimization hook (so archiving never re-enters the optimizer)
 * and is hidden from admin nav and relationship pickers — the role slots only
 * ever point at the served `Font` collection.
 */
export const createFontOriginalCollection = ({ slug = FONT_ORIGINAL_SLUG }: { slug?: string } = {}): CollectionConfig => ({
  slug,
  access: { create: authd, delete: authd, read: authd, update: authd },
  admin: { group: 'Assets', hidden: true, useAsTitle: 'filename' },
  upload: { mimeTypes: FONT_MIME_TYPES },
  fields: [],
})

/** Default `fontOriginal` collection. */
export const FontOriginal: CollectionConfig = createFontOriginalCollection()
