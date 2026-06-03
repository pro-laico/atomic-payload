import { mergeHooks } from '@pro-laico/core'
import type { CollectionConfig, Config, Plugin } from 'payload'

import { Favicons } from './collections/favicons'
import { Images } from './collections/images'

export interface ImagesPluginOptions {
  /** When false, the plugin is a no-op. Defaults to true. */
  enabled?: boolean
  /** When true (default), registers the Favicons collection alongside Images. */
  includeFavicons?: boolean
  /**
   * Override for the Images collection. Top-level keys replace, but
   * `upload`/`access`/`admin` are deep-merged and `fields`/`hooks` are merged —
   * so a partial override can't silently drop the base `imageSizes`, `mimeTypes`,
   * `alt` field, or access rules.
   */
  imagesOverride?: Partial<CollectionConfig>
  /** Override for the Favicons collection (same deep-merge semantics as {@link imagesOverride}). */
  faviconsOverride?: Partial<CollectionConfig>
}

/** Merge an override onto a base collection without clobbering nested config. */
const mergeCollection = (base: CollectionConfig, override?: Partial<CollectionConfig>): CollectionConfig =>
  override
    ? {
        ...base,
        ...override,
        access: { ...base.access, ...override.access },
        admin: { ...base.admin, ...override.admin },
        fields: [...base.fields, ...(override.fields ?? [])],
        upload:
          override.upload && typeof override.upload === 'object' && typeof base.upload === 'object'
            ? { ...base.upload, ...override.upload }
            : (override.upload ?? base.upload),
        hooks: override.hooks ? mergeHooks(base.hooks ?? {}, override.hooks) : base.hooks,
      }
    : base

/**
 * Registers the bundled `Images` and `Favicons` upload collections.
 *
 * Notes on `@oversightstudio/blur-data-urls`: that plugin lives in the
 * consumer because pnpm doesn't hoist optional peers next to this package, so
 * a `require()` from here would silently fail. Wire it yourself after this
 * plugin runs:
 *
 * ```ts
 * import { Images } from '@pro-laico/images'
 * import { blurDataUrlsPlugin } from '@oversightstudio/blur-data-urls'
 *
 * plugins: [
 *   imagesPlugin({ enabled: true }),
 *   blurDataUrlsPlugin({ enabled: true, collections: [Images], blurOptions: {...} }),
 * ]
 * ```
 */
export const imagesPlugin =
  (opts: ImagesPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, includeFavicons = true, imagesOverride, faviconsOverride } = opts
    if (!enabled) return config

    const images = mergeCollection(Images, imagesOverride)
    const favicons = mergeCollection(Favicons, faviconsOverride)

    return { ...config, collections: [...(config.collections ?? []), images, ...(includeFavicons ? [favicons] : [])] }
  }

export default imagesPlugin
