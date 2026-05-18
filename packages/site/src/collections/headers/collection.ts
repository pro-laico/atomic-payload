import { ChildrenBlocksField as ChildrenBlocks } from '@pro-laico/atomic/children'
import { atomicHook } from '@pro-laico/atomic/hook'
import {
  ActiveField,
  APFControlsPath,
  type APFunction,
  ClassNameField,
  DevModeField,
  generateAPFFields,
  generateLivePreviewPath,
  revalidateCacheOnDelete,
  StorageTab,
  TestPathField,
  UniqueTitleField,
} from '@pro-laico/core'
import type { CollectionConfig } from 'payload'
import { authd } from '../../access'

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
