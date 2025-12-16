import { revalidateTag } from '@/utilities/revalidateTag'
import type { CollectionBeforeChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * Unified collection hook that handles all revalidations on document changes.
 * Uses collection slug to determine which revalidation logic to apply.
 */
export const revalidateCache: CollectionBeforeChangeHook = async ({ collection, data, originalDoc, context }) => {
  if (context.isSeed) return
  const slug = collection.slug
  const active = Boolean(data?.active)
  const draft = data?._status === 'draft'

  switch (slug) {
    case 'iconSet':
      if (active) await revalidateTag({ tag: 'iconSet', draft })
      break
    case 'forms':
      await revalidateTag({ tag: 'backend-forms' })
      await revalidateTag({ tag: 'form-submissions', tid: data?.title })
      break
    case 'form-submissions':
      await revalidateTag({ tag: 'form-submissions', tid: data?.form })
      break
    case 'images':
      await revalidateTag({ tag: 'image', tid: originalDoc?.id })
      break
    case 'icon':
      await revalidateTag({ tag: 'icon', tid: originalDoc?.id, draft })
      break
  }
}

/**
 * Unified collection hook that handles all revalidations on document deletion.
 * Uses collection slug to determine which revalidation logic to apply.
 */
export const revalidateCacheOnDelete: CollectionAfterDeleteHook = async ({ collection, doc }) => {
  const { slug: tag } = collection
  switch (tag) {
    case 'footer':
    case 'header':
    case 'iconSet':
    case 'designSet':
    case 'shortcutSet':
      if (Boolean(doc?.active)) await revalidateTag({ tag, draft: false })
      break
    case 'pages':
      revalidateTag({ tag, draft: false })
      revalidateTag({ tag: 'page', tid: doc?.href, draft: false })
      break
  }
}
