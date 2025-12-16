import { anyone } from '@/access/anyone'
import { authd } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'

export const Favicons: CollectionConfig = {
  slug: 'favicons',
  access: { create: authd, delete: authd, read: anyone, update: authd },
  admin: { group: 'Assets', enableListViewSelectAPI: true },
  fields: [],
  upload: { adminThumbnail: 'thumbnail', mimeTypes: ['image/x-icon'] },
}
