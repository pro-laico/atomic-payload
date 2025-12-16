import { anyone } from '@/access/anyone'
import { authd } from '@/access/authenticated'
import { revalidateCache } from '@/hooks/collection/revalidate'
import type { CollectionConfig, ImageUploadFormatOptions } from 'payload'

const formatOptions: ImageUploadFormatOptions = { format: 'webp', options: { nearLossless: true, quality: 75 } }

export const Images: CollectionConfig = {
  slug: 'images',
  access: { create: authd, delete: authd, read: anyone, update: authd },
  admin: { group: 'Assets', enableListViewSelectAPI: true },
  fields: [{ name: 'alt', type: 'text' }],
  hooks: { beforeChange: [revalidateCache] },
  upload: {
    formatOptions,
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif'],
    imageSizes: [
      { formatOptions, name: 'thumbnail', width: 300 },
      { formatOptions, name: 'square', width: 500, height: 500 },
      { formatOptions, name: 'small', width: 600 },
      { formatOptions, name: 'medium', width: 900 },
      { formatOptions, name: 'large', width: 1400 },
      { formatOptions, name: 'xlarge', width: 1920 },
      { formatOptions, name: 'og', width: 1200, height: 630, crop: 'center' },
    ],
  },
}
