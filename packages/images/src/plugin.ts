import type { CollectionConfig, Config, ImageSize, Plugin } from 'payload'

import { mergeCollection } from '@pro-laico/core'
import { Favicons } from './collections/favicons'
import { createImagesCollection } from './collections/images'
import { createGeneratedImagesCollection, GENERATED_IMAGES_SLUG } from './collections/generatedImages'
import { createPurgeEndpoint, createTransformEndpoint, type TransformEndpointConfig } from './endpoints/transform'

export interface ImagesPluginOptions {
  /**
   * When false, the plugin registers NO collections, endpoints, or hooks. This is
   * "not installed", not "temporarily disabled": on SQL adapters, flipping it off for
   * an existing project produces a migration that DROPS the images / generatedImages /
   * favicons tables (and their data). Defaults to true.
   */
  enabled?: boolean
  /** When true (default), registers the Favicons collection alongside Images. */
  includeFavicons?: boolean
  /**
   * Override for the Images collection. Top-level keys replace, but
   * `upload`/`access`/`admin` are deep-merged and `fields`/`hooks` are merged. Note
   * `fields` are APPENDED (not replaced) — don't redeclare a base field's `name`
   * (e.g. `alt`/`variants`), or Payload errors on the duplicate.
   */
  imagesOptions?: Partial<CollectionConfig>
  /** Override for the Favicons collection (same deep-merge semantics). */
  faviconsOptions?: Partial<CollectionConfig>
  /** Override for the hidden generated-images (variant cache) collection. */
  generatedImagesOptions?: Partial<CollectionConfig>
  /**
   * Restore on-upload size generation (the old behavior). Off by default — uploads
   * store only the original and all sizing is on-demand. `true` = legacy 7-size
   * ladder; pass an array for a custom ladder.
   */
  pregenerateSizes?: boolean | ImageSize[]
  /** On-demand transform endpoint config. Pass `false` to not register the endpoints. */
  transform?: TransformEndpointConfig | false
  /** Render the focal + ratio-preview field and purge-variants button. Default true. */
  focalUI?: boolean
  /** Aspect ratios shown in the focal preview tiles. */
  previewRatios?: string[]
}

/**
 * Registers the `Images` (source) and hidden `generatedImages` (variant cache)
 * collections, the `Favicons` collection, and the on-demand transform + purge
 * endpoints.
 *
 * The LQIP placeholder is derived on the frontend by `<ResponsiveImage>` from the
 * smallest transform variant — nothing is stored on the source doc.
 *
 * The transform endpoint mounts at `/api/img`; do not name a collection `img` or it
 * shadows the endpoint.
 */
export const imagesPlugin =
  (opts: ImagesPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const {
      enabled = true,
      includeFavicons = true,
      imagesOptions,
      faviconsOptions,
      generatedImagesOptions,
      pregenerateSizes = false,
      transform = {},
      focalUI = true,
      previewRatios,
    } = opts
    if (!enabled) return config

    const transformCfg: TransformEndpointConfig = transform === false ? {} : transform
    const variantSlug = transformCfg.variantSlug || GENERATED_IMAGES_SLUG
    const sourceSlug = transformCfg.sourceSlug || 'images'
    const basePath = '/img'

    const images = mergeCollection(
      createImagesCollection({ pregenerateSizes, focalUI, previewRatios, variantSlug, purgePath: `${basePath}/purge` }),
      imagesOptions,
    )
    const generated = mergeCollection(createGeneratedImagesCollection({ slug: variantSlug }), generatedImagesOptions)
    const favicons = mergeCollection(Favicons, faviconsOptions)

    const collections = [...(config.collections ?? []), images, generated, ...(includeFavicons ? [favicons] : [])]

    const endpoints =
      transform === false
        ? config.endpoints
        : [
            ...(config.endpoints ?? []),
            createPurgeEndpoint({ variantSlug, sourceSlug }),
            createTransformEndpoint({ ...transformCfg, variantSlug }),
          ]

    const baseSegment = basePath.replace(/^\//, '').split('/')[0]
    const shadowed = transform !== false && collections.some((c) => c.slug === baseSegment)

    return {
      ...config,
      collections,
      endpoints,
      onInit: async (payload) => {
        await config.onInit?.(payload)
        if (shadowed) {
          payload.logger.warn(
            `[images] a collection is named "${baseSegment}", which shadows the transform endpoint at /api/${baseSegment} — rename the collection so it doesn't collide.`,
          )
        }
      },
    }
  }

export default imagesPlugin
