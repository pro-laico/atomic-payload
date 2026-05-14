import type { CollectionConfig, CollectionBeforeChangeHook, Field, PayloadRequest } from 'payload'
import { authd } from '../access/authenticated'
import type { APFunction } from '@pro-laico/atomic-payload-types'
import { APField, ActiveField, generateAPFFields, APFControlsPath } from '@pro-laico/atomic-payload-apf'
import { revalidateCacheOnDelete } from '@pro-laico/ap-utils'

const APFunctions: APFunction[] = ['active']

const d = {
  icon: 'Select an icon',
  name: 'The name of the icon',
}

/** Inline `UniqueTitleField` so the collection has no template dependency. */
const titleField = (defaultValue = 'New Icon Set'): Field => ({
  name: 'title',
  type: 'text',
  required: true,
  unique: true,
  defaultValue,
})

export interface IconSetCollectionOptions {
  /**
   * Optional atomicHook to attach to `beforeChange`. When omitted, no atomicHook is wired -
   * consumers using `atomic-payload-atomic-hook`'s plugin factory can attach it that way.
   */
  atomicHook?: CollectionBeforeChangeHook
  /** Optional live preview URL generator (data, { req }) => string. */
  livePreviewUrl?: (args: { data: Record<string, unknown>; req: PayloadRequest }) => string | Promise<string>
  /** Extra fields appended to the Settings tab row (e.g. a TestPathField). */
  extraSettingsFields?: Field[]
  /** Override the `useAsTitle` admin setting. Defaults to `title`. */
  useAsTitle?: string
  /** Override the admin `group` label. Defaults to `Sets`. */
  group?: string
}

/**
 * Builds the IconSet collection config with the provided hooks/options.
 * Use `createIconSetCollection({...})` rather than importing `IconSet` directly
 * when you need to wire the atomicHook or live preview.
 */
export const createIconSetCollection = (opts: IconSetCollectionOptions = {}): CollectionConfig => {
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
        preview: (data, { req }) => livePreviewUrl({ data: data as Record<string, unknown>, req }),
        livePreview: { url: ({ data, req }) => livePreviewUrl({ data: data as Record<string, unknown>, req }) },
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
export const IconSet: CollectionConfig = createIconSetCollection()
