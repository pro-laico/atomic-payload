import type { GlobalConfig } from 'payload'

import { authd } from '../access/authd'
import { fontUploadFields } from '../fields/font'

/** Slug of the standalone font-selection global. */
export const FONT_SET_SLUG = 'fontSet'

/**
 * A singleton global holding the active sans / serif / mono / display font
 * choices, for projects that use `@pro-laico/fonts` **without**
 * `@pro-laico/styles` (i.e. there is no `designSet` to carry the `font` group).
 *
 * The `atomic-fonts-download` CLI prefers the active design set's `font` group
 * and falls back to this global when no design set is found, so a fonts-only
 * project can still drive `next/font/local`. Register it with
 * `fontsPlugin({ global: true })`.
 */
export const createFontSetGlobal = ({ fontSlug = 'font' }: { fontSlug?: string } = {}): GlobalConfig => ({
  slug: FONT_SET_SLUG,
  admin: { group: 'Assets' },
  access: { read: authd, update: authd },
  fields: fontUploadFields({ fontSlug }),
})

/** Default `fontSet` global bound to the `font` collection. */
export const FontSet: GlobalConfig = createFontSetGlobal()
