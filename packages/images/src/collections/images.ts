import type { CollectionConfig, CollectionSlug, Field, ImageSize, ImageUploadFormatOptions } from 'payload'
import { revalidateCacheCollectionAfterChange, revalidateCacheOnDelete } from '@pro-laico/core'

import { anyone, authd } from '../access'
import { type BlurOptions, generateBlurDataUrl } from '../hooks/blur'
import { purgeStaleVariantsAfterChange, purgeVariantsBeforeDelete } from '../hooks/purge'
import { GENERATED_IMAGES_SLUG } from './generatedImages'

const formatOptions: ImageUploadFormatOptions = { format: 'webp', options: { nearLossless: true, quality: 75 } }

/** Admin component subpaths (referenced by the Payload import map). */
export const FocalPreviewFieldPath = '@pro-laico/images/admin/focalPreview'
export const PurgeVariantsFieldPath = '@pro-laico/images/admin/purgeVariants'

// The pre-3.x ladder, restored only when `pregenerateSizes: true`. With on-demand
// transforms it's off by default (and, under client-side direct uploads, Payload's
// server-side size generation never ran anyway).
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
  const variantSlug = (opts.variantSlug || GENERATED_IMAGES_SLUG) as CollectionSlug
  const imageSizes = pregenerateSizes === true ? LEGACY_IMAGE_SIZES : Array.isArray(pregenerateSizes) ? pregenerateSizes : undefined
  const blurOptions: BlurOptions | undefined = blur === true ? {} : blur || undefined

  const adminFields: Field[] = focalUI
    ? [
        {
          name: 'focalPreview',
          type: 'ui',
          admin: {
            components: {
              Field: { path: FocalPreviewFieldPath, ...(previewRatios ? { clientProps: { previewRatios } } : {}) },
            },
          },
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
      // Auto-populated LQIP placeholder (hidden); `<ResponsiveImage>` reads it.
      ...(blurOptions ? [{ name: 'blurDataUrl', type: 'text', admin: { hidden: true, readOnly: true } } as Field] : []),
      ...adminFields,
      // Virtual back-reference: every generated variant built from this source.
      {
        name: 'variants',
        type: 'join',
        collection: variantSlug,
        on: 'source',
        admin: { defaultColumns: ['filename', 'width', 'height', 'format'], allowCreate: false },
      },
    ],
    // afterChange busts the image cache tag (and purges variants when the file or
    // focal point changed); afterDelete clears the tag and purges all variants.
    hooks: {
      // beforeChange generates the LQIP placeholder from the uploaded bytes (when blur is on).
      ...(blurOptions ? { beforeChange: [generateBlurDataUrl(blurOptions)] } : {}),
      afterChange: [revalidateCacheCollectionAfterChange, purgeStaleVariantsAfterChange({ variantSlug })],
      // beforeDelete purges variants first (SQL FK safety); afterDelete clears the cache tag.
      beforeDelete: [purgeVariantsBeforeDelete({ variantSlug })],
      afterDelete: [revalidateCacheOnDelete],
    },
    // A plain Payload upload: store the original untouched (no re-encode, no sizes
    // by default) and let Payload's native focal point + default admin thumbnail do
    // their normal thing. All sizing/cropping happens on demand at request time.
    upload: {
      focalPoint: true,
      mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif'],
      ...(imageSizes ? { imageSizes } : {}),
    },
  }
}

/** The default Images collection (on-demand transforms, no pre-generated sizes). */
export const Images: CollectionConfig = createImagesCollection()
