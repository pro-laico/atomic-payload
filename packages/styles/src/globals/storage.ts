import type { GlobalConfig } from 'payload'

import { authd } from '../access/authenticated'

/** Factory for the per-state CSS storage globals (`draftStorage` /
 *  `publishedStorage`). These are written by the CSS processor (via `atomicHook`
 *  or the standalone `cssHook`) — they are not intended to be edited directly,
 *  hence no revalidation hook. */
export function baseStorage(name: string): GlobalConfig {
  return {
    slug: `${name}Storage`,
    // Machine-owned: written only by the CSS processor via the Local API
    // (overrideAccess defaults to true, so writes still go through). Deny admin
    // `update` and mark the fields readOnly + hide the global so a manual save
    // can't corrupt the served stylesheet.
    admin: { group: 'Storage', hidden: true },
    access: { read: authd, update: () => false },
    fields: [
      { name: 'cssSize', type: 'number', required: true, admin: { readOnly: true } },
      { name: 'layoutCSS', type: 'code', admin: { language: 'css', readOnly: true }, required: true },
    ],
  }
}
