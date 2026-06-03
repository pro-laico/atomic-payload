import type { CollectionConfig, Config, GlobalConfig, Plugin } from 'payload'

import { Font } from './collections/font'
import { FontSet } from './globals/fontSet'

export interface FontsPluginOptions {
  enabled?: boolean
  /** Shallow-merged onto the `Font` collection (e.g. `upload.staticDir`, `access`, `hooks`). */
  fontOverride?: Partial<CollectionConfig>
  /**
   * Register the standalone `fontSet` global — the active font selection for
   * projects that don't use `@pro-laico/styles`'s designSet. `true` registers
   * the default global; pass a partial `GlobalConfig` to shallow-merge overrides.
   * Defaults to `false` (the designSet's `font` group is the selection source).
   */
  global?: boolean | Partial<GlobalConfig>
}

export const fontsPlugin =
  (opts: FontsPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, fontOverride, global } = opts
    if (!enabled) return config

    const fontCollection: CollectionConfig = fontOverride ? { ...Font, ...fontOverride } : Font
    const collections = [...(config.collections ?? []), fontCollection]

    let globals = config.globals
    if (global) {
      const merged: GlobalConfig = typeof global === 'object' ? { ...FontSet, ...global } : FontSet
      globals = [...(config.globals ?? []), merged]
    }

    return { ...config, collections, globals }
  }

export default fontsPlugin
