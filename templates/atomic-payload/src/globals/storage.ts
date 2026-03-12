import type { GlobalConfig } from 'payload'
import { authd } from '@/access/authenticated'

export function baseStorage(name: string): GlobalConfig {
  return {
    slug: `${name}Storage`,
    admin: { group: 'Storage' },
    access: { read: authd, update: authd },
    fields: [
      { name: 'cssSize', type: 'number', required: true },
      { name: 'layoutCSS', type: 'code', admin: { language: 'css' }, required: true },
    ],
    // Does not have its own revalidation hook because it should not be updated directly.
  }
}
