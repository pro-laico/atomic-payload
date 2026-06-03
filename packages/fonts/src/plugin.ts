import { mergeHooks } from '@pro-laico/core'
import type { CollectionConfig, Config, GlobalConfig, Plugin } from 'payload'

import { Font } from './collections/font'
import { FontSet } from './globals/fontSet'

export interface FontsPluginOptions {
  enabled?: boolean
  /**
   * Merged onto the `Font` collection. Top-level keys replace, but `upload`,
   * `access`, and `hooks` are deep-merged onto the base (so e.g.
   * `upload: { staticDir }` keeps the base `mimeTypes` whitelist and extra hooks
   * are appended, not dropped). `fields` still replaces wholesale.
   */
  fontOverride?: Partial<CollectionConfig>
  /**
   * Register the standalone `fontSet` global — the active font selection for
   * projects that don't use `@pro-laico/styles`'s designSet. `true` registers
   * the default global; pass a partial `GlobalConfig` to override. `fields` are
   * APPENDED to the base font slots and `access` is deep-merged; other top-level
   * keys replace. Defaults to `false` (the designSet's `font` group is the source).
   */
  global?: boolean | Partial<GlobalConfig>
}

export const fontsPlugin =
  (opts: FontsPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, fontOverride, global } = opts
    if (!enabled) return config

    const fontCollection: CollectionConfig = fontOverride
      ? {
          ...Font,
          ...fontOverride,
          // Deep-merge the nested keys a top-level spread would otherwise clobber.
          access: { ...Font.access, ...fontOverride.access },
          upload:
            fontOverride.upload && typeof fontOverride.upload === 'object' && typeof Font.upload === 'object'
              ? { ...Font.upload, ...fontOverride.upload }
              : (fontOverride.upload ?? Font.upload),
          hooks: fontOverride.hooks ? mergeHooks(Font.hooks ?? {}, fontOverride.hooks) : Font.hooks,
        }
      : Font
    const collections = [...(config.collections ?? []), fontCollection]

    let globals = config.globals
    if (global) {
      const merged: GlobalConfig =
        typeof global === 'object'
          ? {
              ...FontSet,
              ...global,
              // Append extra fields to the base font slots; deep-merge access.
              fields: [...FontSet.fields, ...(global.fields ?? [])],
              access: { ...FontSet.access, ...global.access },
            }
          : FontSet
      globals = [...(config.globals ?? []), merged]
    }

    return { ...config, collections, globals }
  }

export default fontsPlugin
