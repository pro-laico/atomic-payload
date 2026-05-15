import { ActiveField, generateAPFFields, APFControlsPath } from '@pro-laico/ap-core'
import type { CollectionConfig } from 'payload'
import { type APFunction } from '@pro-laico/ap-core'
import {
  DevModeField,
  TestPathField,
  ClassNameField,
  UniqueTitleField,
  StorageTab,
  revalidateCacheOnDelete,
  generateLivePreviewPath,
} from '@pro-laico/ap-core'
import { authd } from '../../access'
import { ChildrenBlocksField as ChildrenBlocks } from '@pro-laico/children'
import { atomicHook } from '@pro-laico/ap-atomic-hook'

const APFunctions: APFunction[] = ['form', 'actions', 'classes', 'active']

export const Footer: CollectionConfig = {
  slug: 'footer',
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
          fields: [{ type: 'row', fields: [ActiveField(), DevModeField(), UniqueTitleField('New Footer'), TestPathField] }],
        },
        { label: 'Content', fields: [ClassNameField({ label: 'Footer Elements Class Name' }), ChildrenBlocks] },
        StorageTab(),
      ],
    },
    ...generateAPFFields(APFunctions),
  ],
  hooks: { beforeChange: [atomicHook], afterDelete: [revalidateCacheOnDelete] },
  versions: { drafts: { schedulePublish: true, validate: true }, maxPerDoc: 50 },
}
