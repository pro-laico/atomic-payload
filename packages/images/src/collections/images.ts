import { revalidateCacheCollectionAfterChange, revalidateCacheOnDelete } from '@pro-laico/core'
import type { CollectionConfig, CollectionSlug, Field, ImageSize, ImageUploadFormatOptions } from 'payload'

import { anyone, authd } from '../access'
import { GENERATED_IMAGES_SLUG } from './generatedImages'
import { type BlurOptions, generateBlurDataUrl } from '../hooks/blur'
import { purgeStaleVariantsAfterChange, purgeVariantsBeforeDelete } from '../hooks/purge'

const formatOptions: ImageUploadFormatOptions = { format: 'webp', options: { nearLossless: true, quality: 75 } }

/** Admin component subpaths (referenced by the Payload import map). */
export const FocalPreviewFieldPath = '@pro-laico/images/admin/focalPreview'
export const PurgeVariantsFieldPath = '@pro-laico/images/admin/purgeVariants'

const LEGACY_IMAGE_SIZES: ImageSize[] = [
  { formatOptions, name: 'thumbnail', width: 300 },
  { formatOptions, name: 'square', width: 500, height: 500 },
  { formatOptions, name: 'small', width: 600 },
  { formatOptions, name: 'medium', width: 900 },
  { formatOptions, name: 'large', width: 1400 },
  { formatOptions, name: 'xlarge', width: 1920 },
  { formatOptions, name: 'og', width: 1200, height: 630, crop: 'center' },
]

export interface CreateImagesOptions {
  /** Restore on-upload size generation. `true` = legacy 7-size ladder; array = custom. Default off. */
  pregenerateSizes?: boolean | ImageSize[]
  /** Render the focal-point + ratio-preview field and the purge-variants button. Default true. */
  focalUI?: boolean
  /** Aspect ratios shown in the focal preview tiles. */
  previewRatios?: string[]
  /** Slug of the generated-images collection the `variants` join targets. */
  variantSlug?: string
  /** Purge route (under the API base) the purge button POSTs to. Default `/img/purge`. */
  purgePath?: string
  /**
   * Generate an LQIP blur placeholder on upload, stored in `blurDataUrl` and read by
   * `<ResponsiveImage>`. `true` (default) uses the defaults; pass an object to tune
   * `width` / `height` / `blur`; `false` adds neither the field nor the hook.
   */
  blur?: boolean | BlurOptions
}

/**
 * The source image upload collection. Stores only the original (no pre-generated
 * sizes by default); keeps Payload's built-in `focalPoint` (the focal component
 * enhances it). The on-demand transform endpoint serves every rendered variant and
 * records it in the generated-images collection, surfaced here via the `variants`
 * join and purged by the change/delete hooks.
 */
export const createImagesCollection = (opts: CreateImagesOptions = {}): CollectionConfig => {
  const { pregenerateSizes = false, focalUI = true, previewRatios, purgePath, blur = true } = opts
  const variantSlug = (opts.variantSlug || GENERATED_IMAGES_SLUG) as CollectionSlug //TODO: replace `as` cast with proper typing
  const imageSizes = pregenerateSizes === true ? LEGACY_IMAGE_SIZES : Array.isArray(pregenerateSizes) ? pregenerateSizes : undefined
  const blurOptions: BlurOptions | undefined = blur === true ? {} : blur || undefined

  const adminFields: Field[] = focalUI
    ? [
        {
          name: 'focalPreview',
          type: 'ui',
          admin: { components: { Field: { path: FocalPreviewFieldPath, ...(previewRatios ? { clientProps: { previewRatios } } : {}) } } },
        },
        {
          name: 'purgeVariants',
          type: 'ui',
          admin: { components: { Field: { path: PurgeVariantsFieldPath, ...(purgePath ? { clientProps: { purgePath } } : {}) } } },
        },
      ]
    : []

  return {
    slug: 'images',
    access: { create: authd, delete: authd, read: anyone, update: authd },
    admin: { group: 'Assets', enableListViewSelectAPI: true, useAsTitle: 'alt', defaultColumns: ['alt', 'updatedAt'] },
    fields: [
      { name: 'alt', type: 'text', required: true },
      //TODO: replace `as` cast with proper typing
      ...(blurOptions ? [{ name: 'blurDataUrl', type: 'text', admin: { hidden: true, readOnly: true } } as Field] : []),
      ...adminFields,
      {
        name: 'variants',
        type: 'join',
        collection: variantSlug,
        on: 'source',
        admin: { defaultColumns: ['filename', 'width', 'height', 'format'], allowCreate: false },
      },
    ],
    hooks: {
      ...(blurOptions ? { beforeChange: [generateBlurDataUrl(blurOptions)] } : {}),
      afterChange: [revalidateCacheCollectionAfterChange, purgeStaleVariantsAfterChange({ variantSlug })],
      beforeDelete: [purgeVariantsBeforeDelete({ variantSlug })],
      afterDelete: [revalidateCacheOnDelete],
    },
    upload: { focalPoint: true, mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif'], ...(imageSizes ? { imageSizes } : {}) },
  }
}

/** The default Images collection (on-demand transforms, no pre-generated sizes). */
export const Images: CollectionConfig = createImagesCollection()
