import { APField } from '@/fields/apf'
import { ActiveField } from '@/fields/active'
import { authd } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'
import { type APFunction } from '@/ts/types/apf'
import { TestPathField } from '@/fields/testPath'
import { APFControlsPath, IconLabelPath } from '@/ui'
import { UniqueTitleField } from '@/fields/uniqueTitle'
import { generateAPFFields } from '@/fields/apf/storage'
//import DefaultIconList from '@/collections/iconSets/defaults'
import { atomicHook } from '@/hooks/collection/atomicHook/atomicHook'
import { revalidateCacheOnDelete } from '@/hooks/collection/revalidate'
import { generateLivePreviewPath } from '@/utilities/generatePreviewPath'

const APFunctions: APFunction[] = ['active']

const d = {
  icon: 'Select an icon',
  name: 'The name of the icon',
}

export const IconSet: CollectionConfig = {
  slug: 'iconSet',
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
      tabs: [
        {
          label: 'Settings',
          fields: [{ type: 'row', fields: [ActiveField(), UniqueTitleField('New Icon Set'), TestPathField] }],
        },
        {
          label: 'Icons',
          fields: [
            {
              name: 'iconsArray',
              type: 'array',
              admin: { initCollapsed: true, components: { RowLabel: IconLabelPath } },
              //defaultValue: DefaultIconList,
              fields: [
                {
                  type: 'row',
                  fields: [
                    APField({
                      name: 'name',
                      type: 'text',
                      kebab: true,
                      required: true,
                      admin: { width: '25%', description: d.name, style: { maxWidth: '350px' } },
                    }),
                    {
                      name: 'icon',
                      type: 'upload',
                      relationTo: 'icon',
                      displayPreview: false,
                      admin: { allowCreate: false, width: '75%', description: d.icon, style: { maxWidth: '350px' } },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    ...generateAPFFields(APFunctions),
  ],
  hooks: { beforeChange: [atomicHook], afterDelete: [revalidateCacheOnDelete] },
  versions: { drafts: { schedulePublish: true, validate: true }, maxPerDoc: 50 },
}
