import { APFControlsPath } from '@/ui'
import { SettingsTab } from './tabs/settings'
import { authd } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'
import { ShortcutsTab } from './tabs/shortcuts'
import type { APFunction } from '@/ts/types/apf'
import { generateAPFFields } from '@/fields/apf/storage'
import { atomicHook } from '@/hooks/collection/atomicHook/atomicHook'
import { revalidateCacheOnDelete } from '@/hooks/collection/revalidate'
import { generateLivePreviewPath } from '@/utilities/generatePreviewPath'

const APFunctions: APFunction[] = ['classes', 'active']

const ShortcutSet: CollectionConfig = {
  slug: 'shortcutSet',
  access: { create: authd, delete: authd, read: authd, update: authd },
  admin: {
    group: 'Sets',
    useAsTitle: 'title',
    defaultColumns: ['title', 'active', '_status'],
    preview: (data, { req }) => generateLivePreviewPath({ data, req }),
    livePreview: { url: ({ data, req }) => generateLivePreviewPath({ data, req }) },
    components: { edit: { beforeDocumentControls: [{ path: APFControlsPath, clientProps: { APFunctions } }] } },
  },
  fields: [{ type: 'tabs', tabs: [SettingsTab(), ShortcutsTab()] }, ...generateAPFFields(APFunctions)],
  hooks: { beforeChange: [atomicHook], afterDelete: [revalidateCacheOnDelete] },
  versions: { drafts: { schedulePublish: true, validate: true }, maxPerDoc: 50 },
}

export default ShortcutSet
