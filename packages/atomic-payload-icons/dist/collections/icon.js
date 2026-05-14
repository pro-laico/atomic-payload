import { authd } from '../access/authenticated'
import { formatSVGHook } from '../hooks/formatSVG'
import { revalidateCacheCollection } from '@pro-laico/ap-utils'
export const Icon = {
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
//# sourceMappingURL=icon.js.map
