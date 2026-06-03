import type { GlobalConfig } from 'payload';
/** Slug of the standalone font-selection global. */
export declare const FONT_SET_SLUG = "fontSet";
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
export declare const createFontSetGlobal: ({ fontSlug }?: {
    fontSlug?: string;
}) => GlobalConfig;
/** Default `fontSet` global bound to the `font` collection. */
export declare const FontSet: GlobalConfig;
//# sourceMappingURL=fontSet.d.ts.map