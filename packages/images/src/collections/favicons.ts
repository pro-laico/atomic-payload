import type { CollectionConfig } from 'payload'

import { anyone, authd } from '../access'

export const Favicons: CollectionConfig = {
  slug: 'favicons',
  access: { create: authd, delete: authd, read: anyone, update: authd },
  admin: { group: 'Assets', enableListViewSelectAPI: true },
  fields: [],
  upload: { adminThumbnail: 'thumbnail', mimeTypes: ['image/x-icon'] },
}
