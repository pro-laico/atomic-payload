import type { APFunction } from '@pro-laico/core'
import { APFControlsPath, generateAPFFields, revalidateCacheOnDelete } from '@pro-laico/core'
import type { CollectionBeforeChangeHook, CollectionConfig, PayloadRequest } from 'payload'

import { authd } from '../access/authenticated'
import { ShortcutSettingsTab } from './tabs/settings'
import { createShortcutsTab } from './tabs/shortcuts'

const APFunctions: APFunction[] = ['classes', 'active']

export interface ShortcutSetCollectionOptions {
  /** Wired to `hooks.beforeChange` (typically the project `atomicHook`). Optional — omit to rely solely on `cssHook`. */
  atomicHook?: CollectionBeforeChangeHook
  /** Standalone CSS hook (from `createCssHook`). Appended after `atomicHook`; stays inert when `atomicHook` also runs. */
  cssHook?: CollectionBeforeChangeHook
  /** Same contract as the template `generateLivePreviewPath` helper. */
  generateLivePreviewPath: (args: { data: Partial<unknown>; req: PayloadRequest }) => Promise<string> | string
  /** Defaults to authenticated-only access. */
  access?: CollectionConfig['access']
  /** Shallow-merged onto the built collection (e.g. extra hooks). */
  collection?: Partial<CollectionConfig>
  /**
   * Initial rows for the read-only `defaultShortcuts` field (shown in admin).
   * Document default still starts empty unless you seed documents.
   */
  defaultShortcuts?: unknown[]
}

export function createShortcutSetCollection(opts: ShortcutSetCollectionOptions): CollectionConfig {
  const {
    atomicHook,
    cssHook,
    generateLivePreviewPath,
    access = { create: authd, delete: authd, read: authd, update: authd },
    collection: merge,
    defaultShortcuts = [],
  } = opts
  const beforeChange = [atomicHook, cssHook].filter((h): h is CollectionBeforeChangeHook => Boolean(h))

  const base: CollectionConfig = {
    slug: 'shortcutSet',
    access,
    admin: {
      group: 'Sets',
      useAsTitle: 'title',
      defaultColumns: ['title', 'active', '_status'],
      preview: (data, { req }) => generateLivePreviewPath({ data, req }),
      livePreview: { url: ({ data, req }) => generateLivePreviewPath({ data, req }) },
      components: { edit: { beforeDocumentControls: [{ path: APFControlsPath, clientProps: { APFunctions } }] } },
    },
    fields: [{ type: 'tabs', tabs: [ShortcutSettingsTab(), createShortcutsTab(defaultShortcuts)] }, ...generateAPFFields(APFunctions)],
    hooks: { beforeChange, afterDelete: [revalidateCacheOnDelete] },
    versions: { drafts: { schedulePublish: true, validate: true }, maxPerDoc: 50 },
  }

  return merge ? { ...base, ...merge } : base
}
