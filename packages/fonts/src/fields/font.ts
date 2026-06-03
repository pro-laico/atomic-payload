import type { CollectionSlug, Field } from 'payload'

/**
 * The four font-slot `upload` fields (sans / serif / mono / display), laid out
 * as two rows and pointing at this package's `Font` collection. Shared by both
 * the designSet `font` group ({@link fontUploadField}) and the standalone
 * `fontSet` global (`globals/fontSet.ts`) so the two never drift.
 */
export const fontUploadFields = ({ fontSlug = 'font' }: { fontSlug?: string } = {}): Field[] => {
  const relationTo = fontSlug as CollectionSlug
  // Pre-filter each slot to fonts whose `family` matches, so a `sans` slot can't
  // be pointed at a `mono` font. Assumes the related collection carries the
  // `family` radio from this package's `Font` collection.
  return [
    {
      type: 'row',
      fields: [
        { name: 'sans', type: 'upload', relationTo, filterOptions: { family: { equals: 'sans' } } },
        { name: 'serif', type: 'upload', relationTo, filterOptions: { family: { equals: 'serif' } } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'mono', type: 'upload', relationTo, filterOptions: { family: { equals: 'mono' } } },
        { name: 'display', type: 'upload', relationTo, filterOptions: { family: { equals: 'display' } } },
      ],
    },
  ]
}

/**
 * The `font` group field for the `@pro-laico/styles` designSet's Fonts tab.
 *
 * It lives here, not in `@pro-laico/styles`, so styles carries no hard
 * dependency on a `font` collection. Consumers who want font uploads opt in by
 * passing this field to the plugin:
 *
 * ```ts
 * import { fontUploadField } from '@pro-laico/fonts'
 * stylesPlugin({ designSet: { fontField: fontUploadField() }, ... })
 * ```
 */
export const fontUploadField = ({ fontSlug = 'font' }: { fontSlug?: string } = {}): Field => ({
  name: 'font',
  type: 'group',
  admin: { hideGutter: true },
  fields: fontUploadFields({ fontSlug }),
})
