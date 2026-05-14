import { APFControlsPath } from '@/ui'
import { ActiveField } from '@pro-laico/atomic-payload-apf'
import { authd } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'
import { type APFunction } from '@pro-laico/atomic-payload-types'
import { DevModeField, TestPathField, ClassNameField, UniqueTitleField } from '@pro-laico/ap-utils'
import { generateAPFFields } from '@pro-laico/atomic-payload-apf'
import { ChildrenBlocksField as ChildrenBlocks } from '@pro-laico/atomic-payload-child-blocks'
import { StorageTab } from '@pro-laico/ap-utils'
import { atomicHook } from '@pro-laico/atomic-payload-atomic-hook'
import { revalidateCacheOnDelete } from '@pro-laico/ap-utils'
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
