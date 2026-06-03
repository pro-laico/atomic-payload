import { generateLivePreviewPath, revalidateTag } from '@pro-laico/core'
import { ClassNameField } from '@pro-laico/styles/fields/className'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { exampleBlocks } from '@/blocks/configs'

const authd = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

/** Re-generate + re-read the stylesheet after a page changes. The `cssHook`
 *  (beforeChange) already rewrote the storage globals using this page's freshly
 *  collected classes; busting the `atomic-classes` tag (which cascades to
 *  `site-css`) is what makes the frontend pick the new CSS up. */
const revalidateOnChange: CollectionAfterChangeHook = async () => {
  await revalidateTag('atomic-classes', false)
  await revalidateTag('atomic-classes', true)
}

const revalidateOnDelete: CollectionAfterDeleteHook = async () => {
  await revalidateTag('atomic-classes', false)
  await revalidateTag('atomic-classes', true)
  await revalidateTag('pages', false)
}

/**
 * The `pages` collection — where the example blocks are authored. The standalone
 * `cssHook` (passed in from the config) runs on `beforeChange`: it walks the
 * document for every `*ClassName` value (including those nested in `layout`
 * blocks), stores them in `storedAtomicClasses`, and regenerates the stylesheet.
 * `getCached('atomic-classes')` then reads `storedAtomicClasses` back off every
 * page — closing the back-to-front loop.
 */
export function createPages(cssHook: CollectionBeforeChangeHook): CollectionConfig {
  return {
    slug: 'pages',
    access: { read: () => true, create: authd, update: authd, delete: authd },
    admin: {
      group: 'Content',
      useAsTitle: 'title',
      defaultColumns: ['title', 'href', 'live', '_status'],
      preview: (data, { req }) => generateLivePreviewPath({ data, req }),
      livePreview: { url: ({ data, req }) => generateLivePreviewPath({ data, req }) },
    },
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
          {
            name: 'href',
            type: 'text',
            required: true,
            defaultValue: '/',
            admin: { width: '30%', description: 'The path this page renders at, e.g. `/`.' },
          },
          { name: 'live', type: 'checkbox', required: true, defaultValue: true, admin: { width: '20%' } },
        ],
      },
      {
        type: 'tabs',
        tabs: [
          {
            label: 'Content',
            fields: [
              ClassNameField({ namePrefix: 'main', defaultValue: 'mx-auto max-w-3xl px-6 py-12 flex flex-col gap-16' }),
              { name: 'layout', type: 'blocks', blocks: exampleBlocks },
            ],
          },
          {
            label: 'Storage',
            // The cssHook writes the collected classes here. `defaultValue: []`
            // guarantees the key is present in `data` on create, so the hook's
            // `'storedAtomicClasses' in data` guard passes and the page's classes
            // are stored (and later read by `getCached('atomic-classes')`).
            fields: [
              {
                name: 'storedAtomicClasses',
                type: 'json',
                defaultValue: [],
                admin: { readOnly: true, description: 'Auto-collected from this page on save. Read by the CSS processor.' },
                typescriptSchema: [() => ({ type: 'array', items: { type: 'string' } })],
              },
            ],
          },
        ],
      },
    ],
    hooks: { beforeChange: [cssHook], afterChange: [revalidateOnChange], afterDelete: [revalidateOnDelete] },
    versions: { drafts: { schedulePublish: true, validate: true }, maxPerDoc: 50 },
  }
}
