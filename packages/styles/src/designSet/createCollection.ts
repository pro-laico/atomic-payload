import type { APFunction } from '@pro-laico/core'
import { APFControlsPath, generateAPFFields, revalidateCacheOnDelete } from '@pro-laico/core'
import type { CollectionBeforeChangeHook, CollectionConfig, Field, PayloadRequest } from 'payload'

import { authd } from '../access/authenticated'
import { AnimationsTab } from './tabs/animation'
import { ColorsTab } from './tabs/colors'
import { FontsTab } from './tabs/fonts'
import { MiscellaneousTab } from './tabs/miscellaneous'
import { ProseTab } from './tabs/prose'
import { SettingsTab } from './tabs/settings'
import { SizesTab } from './tabs/sizes'
import { StorageTab } from './tabs/storage'
import { VariablesTab } from './tabs/variables'

const APFunctions: APFunction[] = ['classes', 'active']

export interface DesignSetCollectionOptions {
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
   * Optional font `upload` group injected at the top of the Fonts tab. Pass
   * `fontUploadField()` from `@pro-laico/fonts` to enable font uploads; omit it
   * to keep the designSet free of any `font`-collection dependency.
   */
  fontField?: Field
}

/**
 * Builds the `designSet` collection. Pass your project’s `atomicHook` and
 * `generateLivePreviewPath`; use `stylesPlugin` to register it on the config.
 */
export function createDesignSetCollection(opts: DesignSetCollectionOptions): CollectionConfig {
  const {
    atomicHook,
    cssHook,
    generateLivePreviewPath,
    access = { create: authd, delete: authd, read: authd, update: authd },
    collection: merge,
    fontField,
  } = opts
  const beforeChange = [atomicHook, cssHook].filter((h): h is CollectionBeforeChangeHook => Boolean(h))

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
        tabs: [
          SettingsTab(),
          VariablesTab(),
          ColorsTab(),
          SizesTab(),
          FontsTab(fontField),
          AnimationsTab(),
          MiscellaneousTab(),
          ProseTab,
          StorageTab(),
        ],
      },
      ...generateAPFFields(APFunctions),
    ],
    hooks: { beforeChange, afterDelete: [revalidateCacheOnDelete] },
    versions: { drafts: { schedulePublish: true, validate: true }, maxPerDoc: 50 },
  }

  return merge ? { ...base, ...merge } : base
}
