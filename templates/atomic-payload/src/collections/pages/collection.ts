import { APFControlsPath, SlugPath } from '@/ui'
import { APField } from '@pro-laico/atomic-payload-apf'
import { slugField } from '@pro-laico/ap-utils'
import { authd } from '@/access/authenticated'
import { type APFunction } from '@/ts/types'
import type { CollectionConfig } from 'payload'
import { ClassNameField } from '@pro-laico/ap-utils'
import { updateHrefHook } from '@pro-laico/ap-utils'
import { SEOTab } from '@/collections/pages/tabs/SEO'
import { ChildrenBlocksField as ChildrenBlocks } from '@pro-laico/atomic-payload-child-blocks'
import { StorageTab } from '@pro-laico/ap-utils'
import { SettingsTab } from '@/collections/pages/tabs/settings'
import { updatePublishedAtHook } from '@pro-laico/ap-utils'
import { createParentField } from '@payloadcms/plugin-nested-docs'
import { atomicHook } from '@/hooks/collection/atomicHook/atomicHook'
import { revalidateCacheOnDelete } from '@pro-laico/ap-utils'
import { generateLivePreviewPath } from '@/utilities/generatePreviewPath'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

const APFunctions: APFunction[] = ['form', 'page', 'pages', 'actions', 'classes', 'seo', 'sitemap']

const d = {
  liveDescription: 'If unchecked, the page will not be indexed by search engines, and can only be viewed in admins live preview.',
}

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  defaultPopulate: { title: true, slug: true, href: true },
  access: { create: authd, delete: authd, read: authenticatedOrPublished, update: authd },
  admin: {
    group: 'Website',
    useAsTitle: 'href',
    enableListViewSelectAPI: true,
    preview: (data, { req }) => generateLivePreviewPath({ data, req }),
    livePreview: { url: ({ data, req }) => generateLivePreviewPath({ data, req }) },
    defaultColumns: ['href', 'title', 'publishedAt'],
    components: { edit: { beforeDocumentControls: [{ path: APFControlsPath, clientProps: { APFunctions } }] } },
  },
  fields: [
    {
      type: 'row',
      fields: [
        APField({ type: 'text', apf: ['page'], name: 'title', required: true, admin: { width: '50%', style: { maxWidth: '500px' } } }),
        {
          type: 'date',
          name: 'publishedAt',
          hooks: { beforeChange: [updatePublishedAtHook] },
          admin: { width: '30%', style: { maxWidth: '300px' } },
        },
      ],
    },
    ...slugField(SlugPath, 'title', {
      slugOverrides: { admin: { width: '30%', style: { maxWidth: '300px' } } },
    }),
    {
      type: 'row',
      fields: [
        createParentField('pages', { name: 'parent', admin: { width: '30%', style: { maxWidth: '305px' }, allowCreate: false } }),
        APField({
          type: 'text',
          name: 'href',
          apf: ['page', 'pages'],
          hooks: { beforeChange: [updateHrefHook] },
          admin: { width: '30%', readOnly: true, style: { maxWidth: '300px' } },
        }),
        APField({
          type: 'checkbox',
          apf: ['page', 'pages', 'sitemap'],
          name: 'live',
          required: true,
          defaultValue: true,
          admin: { width: '20%', description: d.liveDescription },
        }),
      ],
    },
    {
      type: 'tabs',
      tabs: [
        { label: 'Content', fields: [ClassNameField({ namePrefix: 'main', defaultValue: 'page-main' }), ChildrenBlocks] },
        SEOTab(),
        StorageTab(),
        SettingsTab(),
      ],
    },
  ],
  hooks: { beforeChange: [atomicHook], afterDelete: [revalidateCacheOnDelete] },
  versions: { drafts: { schedulePublish: true, validate: true }, maxPerDoc: 50 },
}
