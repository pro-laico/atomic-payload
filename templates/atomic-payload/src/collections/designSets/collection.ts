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
import { type APFunction } from '@pro-laico/atomic-payload-types'
import { AnimationsTab } from './tabs/animation'
import { MiscellaneousTab } from './tabs/miscellaneous'
import { generateAPFFields } from '@pro-laico/atomic-payload-apf'
import { atomicHook } from '@/hooks/collection/atomicHook/atomicHook'
import { revalidateCacheOnDelete } from '@pro-laico/atomic-payload-revalidation'
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
      tabs: [SettingsTab(), VariablesTab(), ColorsTab(), SizesTab(), FontsTab(), AnimationsTab(), MiscellaneousTab(), ProseTab, StorageTab()],
    },
    ...generateAPFFields(APFunctions),
  ],
  hooks: { beforeChange: [atomicHook], afterDelete: [revalidateCacheOnDelete] },
  versions: { drafts: { schedulePublish: true, validate: true }, maxPerDoc: 50 },
}

export default DesignSet
