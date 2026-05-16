import { APFControlsPath, generateAPFFields } from '@pro-laico/core'
import { authd } from '../access/authenticated'
import type { CollectionConfig, CollectionBeforeChangeHook, PayloadRequest } from 'payload'
import type { APFunction } from '@pro-laico/core'
import { revalidateCacheOnDelete } from '@pro-laico/core'
import { FontsTab } from './tabs/fonts'
import { SizesTab } from './tabs/sizes'
import { ProseTab } from './tabs/prose'
import { ColorsTab } from './tabs/colors'
import { StorageTab } from './tabs/storage'
import { SettingsTab } from './tabs/settings'
import { VariablesTab } from './tabs/variables'
import { AnimationsTab } from './tabs/animation'
import { MiscellaneousTab } from './tabs/miscellaneous'

const APFunctions: APFunction[] = ['classes', 'active']

export interface DesignSetCollectionOptions {
  /** Wired to `hooks.beforeChange` (typically the project `atomicHook`). */
  atomicHook: CollectionBeforeChangeHook
  /** Same contract as the template `generateLivePreviewPath` helper. */
  generateLivePreviewPath: (args: { data: Partial<unknown>; req: PayloadRequest }) => Promise<string> | string
  /** Defaults to authenticated-only access. */
  access?: CollectionConfig['access']
  /** Shallow-merged onto the built collection (e.g. extra hooks). */
  collection?: Partial<CollectionConfig>
}

/**
 * Builds the `designSet` collection. Pass your project’s `atomicHook` and
 * `generateLivePreviewPath`; use `designSetsPlugin` to register it on the config.
 */
export function createDesignSetCollection(opts: DesignSetCollectionOptions): CollectionConfig {
  const {
    atomicHook,
    generateLivePreviewPath,
    access = { create: authd, delete: authd, read: authd, update: authd },
    collection: merge,
  } = opts

  const base: CollectionConfig = {
    slug: 'designSet',
    access,
    admin: {
      group: 'Sets',
      useAsTitle: 'title',
      enableListViewSelectAPI: true,
      defaultColumns: ['title', 'active', '_status'],
      preview: (data, { req }) => generateLivePreviewPath({ data, req }),
      livePreview: { url: ({ data, req }) => generateLivePreviewPath({ data, req }) },
      components: { edit: { beforeDocumentControls: [{ path: APFControlsPath, clientProps: { APFunctions } }] } },
    },
    fields: [
      {
        type: 'tabs',
        tabs: [SettingsTab(), VariablesTab(), ColorsTab(), SizesTab(), FontsTab(), AnimationsTab(), MiscellaneousTab(), ProseTab, StorageTab()],
      },
      ...generateAPFFields(APFunctions),
    ],
    hooks: { beforeChange: [atomicHook], afterDelete: [revalidateCacheOnDelete] },
    versions: { drafts: { schedulePublish: true, validate: true }, maxPerDoc: 50 },
  }

  return merge ? { ...base, ...merge } : base
}
