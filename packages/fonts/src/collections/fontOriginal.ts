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
 * Upload collection holding the raw, untouched font files editors drop into the
 * `Font` typeface's `upload` fields. It's the archive of truth: the `Font` save
 * hook reads these and subsets each to a served `fontOptimized` WOFF2, so the
 * (lossy, subsetted) output can be re-derived with a different charset later.
 *
 * It carries NO hooks — uploading here is a plain store, which is exactly what
 * lets it be a client-upload (direct-to-Blob) collection in production. Hidden
 * from admin nav; editors only ever interact with it through the `Font` fields.
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
