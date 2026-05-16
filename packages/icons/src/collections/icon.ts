import { authd } from '../access/authenticated'
import type { CollectionConfig } from 'payload'
import { formatSVGHook } from '../hooks/formatSVG'
import { revalidateCacheCollection } from '@pro-laico/core'

export const Icon: CollectionConfig = {
  slug: 'icon',
  access: { create: authd, delete: authd, read: authd, update: authd },
  admin: { group: 'Assets', useAsTitle: 'filename', enableListViewSelectAPI: true, defaultColumns: ['filename', 'filesize', 'updatedAt'] },
  fields: [
    { type: 'text', name: 'optimized', admin: { readOnly: true, condition: (data) => Boolean(data?.optimized) } },
    {
      type: 'code',
      name: 'svgString',
      admin: { language: 'xml', condition: (data) => Boolean(data?.svgString), editorOptions: { wordWrap: 'off', scrollBeyondLastLine: false } },
    },
  ],
  upload: { mimeTypes: ['image/svg+xml'] },
  hooks: { beforeChange: [formatSVGHook, revalidateCacheCollection] },
}
