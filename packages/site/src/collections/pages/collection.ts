import { createParentField } from '@payloadcms/plugin-nested-docs'
import { ChildrenBlocksField as ChildrenBlocks } from '@pro-laico/atomic/children'
import { atomicHook } from '@pro-laico/atomic/hook'
import {
  APFControlsPath,
  APField,
  type APFunction,
  generateLivePreviewPath,
  revalidateCacheOnDelete,
  SlugPath,
  StorageTab,
  slugField,
  updateHrefHook,
  updatePublishedAtHook,
} from '@pro-laico/core'
import { ClassNameField } from '@pro-laico/styles/fields/className'
import type { CollectionConfig } from 'payload'

import { authd, authenticatedOrPublished } from '../../access'
import { SEOTab } from './tabs/SEO'
import { SettingsTab } from './tabs/settings'

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
    // `title` (required) is always populated; `href` is empty until the first
    // save (it's derived from breadcrumbs), so titling by it blanks new docs.
    // `href` stays in defaultColumns below.
    useAsTitle: 'title',
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
          // href is the canonical page identity (cache key + getCachedPageByHref
          // lookup + useAsTitle), so index it to avoid an unindexed scan per
          // lookup. Not `unique` — hrefs are derived from the breadcrumb tree and
          // a unique constraint would reject legitimate edge cases / seed reruns.
          index: true,
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
        SettingsTab(APFunctions),
      ],
    },
  ],
  hooks: { beforeChange: [atomicHook], afterDelete: [revalidateCacheOnDelete] },
  versions: { drafts: { schedulePublish: true, validate: true }, maxPerDoc: 50 },
}
