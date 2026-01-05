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
      if (active) await revalidateTag('iconSet', draft)
      break
    case 'forms':
      await revalidateTag('backend-forms')
      await revalidateTag('form-submissions', data?.title)
      break
    case 'form-submissions':
      await revalidateTag('form-submissions', data?.form)
      break
    case 'images':
      await revalidateTag('image', originalDoc?.id)
      break
    case 'icon':
      await revalidateTag('icon', originalDoc?.id, draft)
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
      if (Boolean(doc?.active)) await revalidateTag(tag, false)
      break
    case 'pages':
      revalidateTag(tag, false)
      revalidateTag('page', doc?.href, false)
      break
  }
}
