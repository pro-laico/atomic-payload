import { APFControlsPath, generateAPFFields } from '@pro-laico/ap-core'
import { authd } from '../access/authenticated'
import type { CollectionConfig, CollectionBeforeChangeHook, PayloadRequest } from 'payload'
import type { APFunction } from '@pro-laico/ap-core'
import { revalidateCacheOnDelete } from '@pro-laico/ap-core'
import { createShortcutsTab } from './tabs/shortcuts'
import { ShortcutSettingsTab } from './tabs/settings'

const APFunctions: APFunction[] = ['classes', 'active']

export interface ShortcutSetCollectionOptions {
  /** Wired to `hooks.beforeChange` (typically the project `atomicHook`). */
  atomicHook: CollectionBeforeChangeHook
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
    generateLivePreviewPath,
    access = { create: authd, delete: authd, read: authd, update: authd },
    collection: merge,
    defaultShortcuts = [],
  } = opts

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
    fields: [
      { type: 'tabs', tabs: [ShortcutSettingsTab(), createShortcutsTab(defaultShortcuts)] },
      ...generateAPFFields(APFunctions),
    ],
    hooks: { beforeChange: [atomicHook], afterDelete: [revalidateCacheOnDelete] },
    versions: { drafts: { schedulePublish: true, validate: true }, maxPerDoc: 50 },
  }

  return merge ? { ...base, ...merge } : base
}
