import type { CollectionConfig, Config, Plugin } from 'payload'
import { Favicons } from './collections/favicons'
import { Images } from './collections/images'

export interface ImagesPluginOptions {
  /** When false, the plugin is a no-op. Defaults to true. */
  enabled?: boolean
  /** When true (default), registers the Favicons collection alongside Images. */
  includeFavicons?: boolean
  /** Shallow override for the Images collection. */
  imagesOverride?: Partial<CollectionConfig>
  /** Shallow override for the Favicons collection. */
  faviconsOverride?: Partial<CollectionConfig>
}

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

    const images: CollectionConfig = imagesOverride ? { ...Images, ...imagesOverride } : Images
    const favicons: CollectionConfig = faviconsOverride ? { ...Favicons, ...faviconsOverride } : Favicons

    return { ...config, collections: [...(config.collections ?? []), images, ...(includeFavicons ? [favicons] : [])] }
  }

export default imagesPlugin
