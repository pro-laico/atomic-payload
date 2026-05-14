import { authd } from '../access/authenticated'
import { APField, ActiveField, generateAPFFields, APFControlsPath } from '@pro-laico/atomic-payload-apf'
import { revalidateCacheOnDelete } from '@pro-laico/ap-utils'
const APFunctions = ['active']
const d = {
  icon: 'Select an icon',
  name: 'The name of the icon',
}
/** Inline `UniqueTitleField` so the collection has no template dependency. */
const titleField = (defaultValue = 'New Icon Set') => ({
  name: 'title',
  type: 'text',
  required: true,
  unique: true,
  defaultValue,
})
/**
 * Builds the IconSet collection config with the provided hooks/options.
 * Use `createIconSetCollection({...})` rather than importing `IconSet` directly
 * when you need to wire the atomicHook or live preview.
 */
export const createIconSetCollection = (opts = {}) => {
  const { atomicHook, livePreviewUrl, extraSettingsFields = [], useAsTitle = 'title', group = 'Sets' } = opts
  return {
    slug: 'iconSet',
    access: { create: authd, delete: authd, read: authd, update: authd },
    admin: {
      group,
      useAsTitle,
      enableListViewSelectAPI: true,
      defaultColumns: ['title', 'active', '_status'],
      ...(livePreviewUrl && {
        preview: (data, { req }) => livePreviewUrl({ data: data, req }),
        livePreview: { url: ({ data, req }) => livePreviewUrl({ data: data, req }) },
      }),
      components: { edit: { beforeDocumentControls: [{ path: APFControlsPath, clientProps: { APFunctions } }] } },
    },
    fields: [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'Settings',
            fields: [{ type: 'row', fields: [ActiveField(), titleField('New Icon Set'), ...extraSettingsFields] }],
          },
          {
            label: 'Icons',
            fields: [
              {
                name: 'iconsArray',
                type: 'array',
                admin: { initCollapsed: true, components: { RowLabel: '@pro-laico/atomic-payload-icons/admin/iconRowLabel' } },
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
    hooks: {
      beforeChange: atomicHook ? [atomicHook] : [],
      afterDelete: [revalidateCacheOnDelete],
    },
    versions: { drafts: { schedulePublish: true, validate: true }, maxPerDoc: 50 },
  }
}
/** Default IconSet collection with no atomicHook and no live preview wired. */
export const IconSet = createIconSetCollection()
//# sourceMappingURL=iconSet.js.map
