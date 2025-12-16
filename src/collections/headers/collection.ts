import { APFControlsPath } from '@/ui'
import { ActiveField } from '@/fields/active'
import { authd } from '@/access/authenticated'
import { DevModeField } from '@/fields/devMode'
import type { CollectionConfig } from 'payload'
import { type APFunction } from '@/ts/types/apf'
import { TestPathField } from '@/fields/testPath'
import { ClassNameField } from '@/fields/className'
import { UniqueTitleField } from '@/fields/uniqueTitle'
import { generateAPFFields } from '@/fields/apf/storage'
import { ChildrenBlocks } from '@/fields/blocks/children'
import { StorageTab } from '@/fields/tabs/collection/storage'
import { atomicHook } from '@/hooks/collection/atomicHook/atomicHook'
import { revalidateCacheOnDelete } from '@/hooks/collection/revalidate'
import { generateLivePreviewPath } from '@/utilities/generatePreviewPath'

const APFunctions: APFunction[] = ['form', 'actions', 'classes', 'active']

export const Header: CollectionConfig = {
  slug: 'header',
  access: { create: authd, delete: authd, read: authd, update: authd },
  admin: {
    group: 'Website',
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
        {
          label: 'Settings',
          fields: [{ type: 'row', fields: [ActiveField(), DevModeField(), UniqueTitleField('New Header'), TestPathField] }],
        },
        { label: 'Content', fields: [ClassNameField({ label: 'Header Elements Class Name' }), ChildrenBlocks] },
        StorageTab(),
      ],
    },
    ...generateAPFFields(APFunctions),
  ],
  hooks: { beforeChange: [atomicHook], afterDelete: [revalidateCacheOnDelete] },
  versions: { drafts: { schedulePublish: true, validate: true }, maxPerDoc: 50 },
}
