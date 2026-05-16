import type { GlobalConfig } from 'payload'
import { authd } from '../access'

/** Factory for the per-state CSS storage globals (`draftStorage` /
 *  `publishedStorage`). These are written by `atomicHook` — they are not
 *  intended to be edited directly, hence no revalidation hook. */
export function baseStorage(name: string): GlobalConfig {
  return {
    slug: `${name}Storage`,
    admin: { group: 'Storage' },
    access: { read: authd, update: authd },
    fields: [
      { name: 'cssSize', type: 'number', required: true },
      { name: 'layoutCSS', type: 'code', admin: { language: 'css' }, required: true },
    ],
  }
}
