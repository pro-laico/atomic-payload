import { authd } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'

export const Font: CollectionConfig = {
  slug: 'font',
  access: { create: authd, delete: authd, read: authd, update: authd },
  admin: { group: 'Assets', useAsTitle: 'title', enableListViewSelectAPI: true, defaultColumns: ['title', 'family'] },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'family',
      type: 'radio',
      required: true,
      label: 'Preferred Family',
      interfaceName: 'GenericFontFamily',
      options: ['sans', 'serif', 'mono', 'display'],
    },
  ],
  upload: { mimeTypes: ['font/ttf', 'font/woff', 'font/woff2', 'font/otf'] },
}
