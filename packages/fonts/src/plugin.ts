import type { CollectionConfig, Config, GlobalConfig, Plugin } from 'payload'

import { mergeCollection, mergeGlobal } from '@pro-laico/core'

import { Font } from './collections/font'
import { FontSet, FONT_SET_SLUG } from './globals/fontSet'
import { exportFontsEndpoint } from './endpoints/exportFonts'

export interface FontsPluginOptions {
  /** When false, the plugin is a no-op. Defaults to true. */
  enabled?: boolean
  /**
   * Merged onto the `Font` collection. Top-level keys replace, but `upload`,
   * `access`, and `hooks` are deep-merged onto the base (so e.g.
   * `upload: { staticDir }` keeps the base `mimeTypes` whitelist and extra hooks
   * are appended, not dropped), and `fields` are appended.
   */
  fontOptions?: Partial<CollectionConfig>
  /**
   * Register the standalone `fontSet` global — the active font selection for
   * projects that don't use `@pro-laico/styles`'s designSet. Defaults to `false`
   * (the designSet's `font` group is the source). Pair with {@link fontSetOptions}
   * to extend the registered global.
   */
  includeFontSet?: boolean
  /**
   * Merged onto the `fontSet` global when {@link includeFontSet} is true.
   * `fields` are APPENDED to the base font slots and `access` is deep-merged;
   * other top-level keys replace.
   */
  fontSetOptions?: Partial<GlobalConfig>
}

export const fontsPlugin =
  (opts: FontsPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, fontOptions, includeFontSet = false, fontSetOptions } = opts
    if (!enabled) return config

    const collections = [...(config.collections ?? []), mergeCollection(Font, fontOptions)]
    const globals = includeFontSet ? [...(config.globals ?? []), mergeGlobal(FontSet, fontSetOptions)] : config.globals
    const endpoints = [...(config.endpoints ?? []), exportFontsEndpoint({ fontSetGlobalSlug: FONT_SET_SLUG, fontCollectionSlug: Font.slug })]

    return { ...config, collections, globals, endpoints }
  }

export default fontsPlugin
