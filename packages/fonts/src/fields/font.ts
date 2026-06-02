import type { CollectionSlug, Field } from 'payload'

/**
 * The `font` group field for the `@pro-laico/styles` designSet's Fonts tab —
 * four `upload` fields (sans / serif / mono / display) pointing at this
 * package's `Font` collection.
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
export const fontUploadField = ({ fontSlug = 'font' }: { fontSlug?: string } = {}): Field => {
  const relationTo = fontSlug as CollectionSlug
  return {
    name: 'font',
    type: 'group',
    admin: { hideGutter: true },
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'sans', type: 'upload', relationTo },
          { name: 'serif', type: 'upload', relationTo },
        ],
      },
      {
        type: 'row',
        fields: [
          { name: 'mono', type: 'upload', relationTo },
          { name: 'display', type: 'upload', relationTo },
        ],
      },
    ],
  }
}
