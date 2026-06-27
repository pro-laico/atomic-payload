import type { CollectionConfig, CollectionSlug } from 'payload'

import { authd } from '../access'

export const GENERATED_IMAGES_SLUG = 'generatedImages'

export interface CreateGeneratedImagesOptions {
  /** Slug for this collection. Default `generatedImages`. */
  slug?: string
  /** Slug of the source image collection the variants point back to. Default `images`. */
  sourceSlug?: string
}

/**
 * The hidden, durable cache of on-demand image variants. The transform endpoint
 * writes one upload doc here per (source, settings, focal) combination; the source
 * `images` collection surfaces them through a `join` field and purges them when the
 * source changes or is deleted.
 *
 * It is an UPLOAD collection so variant bytes flow through whatever storage adapter
 * is configured (local disk, S3, Vercel Blob, …) — keeping the feature
 * platform-agnostic. In the template it must be registered with a SERVER-upload
 * storage instance, since the endpoint creates docs server-side via the Local API.
 *
 * Deliberately carries NO revalidation hooks: variants are derived and disposable,
 * so busting cache tags on every cache-miss create would be pure churn.
 */
export const createGeneratedImagesCollection = (opts: CreateGeneratedImagesOptions = {}): CollectionConfig => {
  const slug = opts.slug || GENERATED_IMAGES_SLUG
  const sourceSlug = (opts.sourceSlug || 'images') as CollectionSlug //TODO: replace `as` cast with proper typing

  return {
    slug,
    access: { create: authd, delete: authd, read: authd, update: authd },
    admin: { hidden: true, group: 'Assets', useAsTitle: 'cacheKey', defaultColumns: ['cacheKey', 'width', 'height', 'format'] },
    fields: [
      { name: 'source', type: 'relationship', relationTo: sourceSlug, required: true, index: true },
      { name: 'cacheKey', type: 'text', required: true, unique: true },
      {
        type: 'row',
        fields: [
          { name: 'fit', type: 'text' },
          { name: 'format', type: 'text' },
          { name: 'quality', type: 'number' },
        ],
      },
      {
        type: 'row',
        fields: [
          { name: 'focalX', type: 'number' },
          { name: 'focalY', type: 'number' },
        ],
      },
    ],
    upload: { mimeTypes: ['image/avif', 'image/webp', 'image/jpeg', 'image/png'] },
  }
}

/** The default generated-images collection. */
export const GeneratedImages: CollectionConfig = createGeneratedImagesCollection()
