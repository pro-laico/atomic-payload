import type { Field } from 'payload';
/**
 * The four font-slot `upload` fields (sans / serif / mono / display), laid out
 * as two rows and pointing at this package's `Font` collection. Shared by both
 * the designSet `font` group ({@link fontUploadField}) and the standalone
 * `fontSet` global (`globals/fontSet.ts`) so the two never drift.
 */
export declare const fontUploadFields: ({ fontSlug }?: {
    fontSlug?: string;
}) => Field[];
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
export declare const fontUploadField: ({ fontSlug }?: {
    fontSlug?: string;
}) => Field;
//# sourceMappingURL=font.d.ts.map