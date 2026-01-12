import { APFControlsPath } from '@/ui'
import { FontsTab } from './tabs/fonts'
import { SizesTab } from './tabs/sizes'
import { ProseTab } from './tabs/prose'
import { ColorsTab } from './tabs/colors'
import { StorageTab } from './tabs/storage'
import { SettingsTab } from './tabs/settings'
import { authd } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'
import { VariablesTab } from './tabs/variables'
import { type APFunction } from '@/ts/types/apf'
import { AnimationsTab } from './tabs/animation'
import { MiscellaneousTab } from './tabs/miscellaneous'
import { generateAPFFields } from '@/fields/apf/storage'
import { atomicHook } from '@/hooks/collection/atomicHook/atomicHook'
import { revalidateCacheOnDelete } from '@/hooks/collection/revalidate'
import { generateLivePreviewPath } from '@/utilities/generatePreviewPath'

const APFunctions: APFunction[] = ['classes', 'active']

const DesignSet: CollectionConfig = {
  slug: 'designSet',
  access: { create: authd, delete: authd, read: authd, update: authd },
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
      tabs: [SettingsTab(), VariablesTab(), ColorsTab(), SizesTab(), FontsTab(), AnimationsTab(), MiscellaneousTab(), StorageTab(), ProseTab],
    },
    ...generateAPFFields(APFunctions),
  ],
  hooks: { beforeChange: [atomicHook], afterDelete: [revalidateCacheOnDelete] },
  versions: { drafts: { schedulePublish: true, validate: true }, maxPerDoc: 50 },
}

export default DesignSet
