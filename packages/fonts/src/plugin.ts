import type { CollectionConfig, Config, GlobalConfig, Plugin } from 'payload'

import { mergeCollection, mergeGlobal } from '@pro-laico/core'

import { createFontCollection } from './collections/font'
import { createFontOptimizedCollection, FONT_OPTIMIZED_SLUG } from './collections/fontOptimized'
import { createFontOriginalCollection, FONT_ORIGINAL_SLUG } from './collections/fontOriginal'
import { FontSet, FONT_SET_SLUG } from './globals/fontSet'
import { exportFontsEndpoint } from './endpoints/exportFonts'

export interface FontsPluginOptions {
  /** When false, the plugin is a no-op. Defaults to true. */
  enabled?: boolean
  /**
   * Characters the subsetter keeps when building the served WOFF2 files: a preset
   * name (`'latin'` — ASCII + Latin-1 + common punctuation, the default; or
   * `'latin-ext'`) or an explicit string of characters to retain.
   */
  charset?: 'latin' | 'latin-ext' | (string & {})
  /** Merged onto the visible `Font` (typeface) collection. */
  fontOptions?: Partial<CollectionConfig>
  /**
   * Merged onto the hidden `fontOriginal` upload collection (the raw archive
   * editors upload into) — e.g. `upload: { staticDir }`.
   */
  fontOriginalOptions?: Partial<CollectionConfig>
  /** Merged onto the hidden `fontOptimized` upload collection (the served WOFF2s). */
  fontOptimizedOptions?: Partial<CollectionConfig>
  /**
   * Register the standalone `fontSet` global — the active font selection for
   * projects that don't use `@pro-laico/styles`'s designSet. Defaults to `false`.
   */
  includeFontSet?: boolean
  /** Merged onto the `fontSet` global when {@link includeFontSet} is true. */
  fontSetOptions?: Partial<GlobalConfig>
}

/**
 * `@pro-laico/fonts` — three collections, standard Payload primitives:
 *
 * - `font` (visible): the typeface. Editors drop files into `upload` fields
 *   backed by `fontOriginal` (a `variable` group or a `weights` array).
 * - `fontOriginal` (hidden): the raw uploaded files. Register it with your
 *   storage adapter's client-uploads instance to keep big fonts off the request
 *   body in production.
 * - `fontOptimized` (hidden): the subsetted WOFF2 the site serves, built from the
 *   originals by the `Font` save hook. Always server-side stored.
 */
export const fontsPlugin =
  (opts: FontsPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, charset, fontOptions, fontOriginalOptions, fontOptimizedOptions, includeFontSet = false, fontSetOptions } = opts
    if (!enabled) return config

    const collections = [
      ...(config.collections ?? []),
      mergeCollection(createFontCollection({ charset, originalSlug: FONT_ORIGINAL_SLUG, optimizedSlug: FONT_OPTIMIZED_SLUG }), fontOptions),
      mergeCollection(createFontOriginalCollection(), fontOriginalOptions),
      mergeCollection(createFontOptimizedCollection({ fontSlug: 'font', originalSlug: FONT_ORIGINAL_SLUG }), fontOptimizedOptions),
    ]

    const globals = includeFontSet ? [...(config.globals ?? []), mergeGlobal(FontSet, fontSetOptions)] : config.globals
    const endpoints = [...(config.endpoints ?? []), exportFontsEndpoint({ fontSetGlobalSlug: FONT_SET_SLUG, fontOptimizedSlug: FONT_OPTIMIZED_SLUG })]

    return { ...config, collections, globals, endpoints }
  }

export default fontsPlugin
