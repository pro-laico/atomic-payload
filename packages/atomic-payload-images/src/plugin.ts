import type { Config, Plugin, CollectionConfig } from 'payload'
import { Images } from './collections/images'
import { Favicons } from './collections/favicons'

export interface ImagesPluginOptions {
  /** When false, the plugin is a no-op. Defaults to true. */
  enabled?: boolean
  /** When true (default), registers the Favicons collection alongside Images. */
  includeFavicons?: boolean
  /** Shallow override for the Images collection. */
  imagesOverride?: Partial<CollectionConfig>
  /** Shallow override for the Favicons collection. */
  faviconsOverride?: Partial<CollectionConfig>
  /**
   * When true (default) the plugin will attempt to register the
   * `@oversightstudio/blur-data-urls` plugin on the Images collection. Set to
   * false if you wire it externally (or don't want blur data URLs).
   */
  blurDataUrls?: boolean
  /** Options for the blur data urls plugin. */
  blurOptions?: { blur?: number; width?: number; height?: number | 'auto' }
}

export const imagesPlugin =
  (opts: ImagesPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const {
      enabled = true,
      includeFavicons = true,
      imagesOverride,
      faviconsOverride,
      blurDataUrls = true,
      blurOptions = { blur: 18, width: 32, height: 'auto' },
    } = opts
    if (!enabled) return config

    const images: CollectionConfig = imagesOverride ? { ...Images, ...imagesOverride } : Images
    const favicons: CollectionConfig = faviconsOverride ? { ...Favicons, ...faviconsOverride } : Favicons

    let next: Config = { ...config, collections: [...(config.collections ?? []), images, ...(includeFavicons ? [favicons] : [])] }

    if (blurDataUrls) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require('@oversightstudio/blur-data-urls') as { blurDataUrlsPlugin: (o: unknown) => Plugin }
        const blurPlugin = mod.blurDataUrlsPlugin({ enabled: true, collections: [images], blurOptions })
        const result = blurPlugin(next)
        if (result instanceof Promise) {
          console.warn('[atomic-payload-images] blurDataUrlsPlugin returned a Promise; skipping (plugin must be applied synchronously).')
        } else {
          next = result
        }
      } catch {
        // @oversightstudio/blur-data-urls not installed; skip silently.
      }
    }

    return next
  }

export default imagesPlugin
