import type { GlobalBeforeChangeHook } from 'payload'
import { revalidateTag } from '@/utilities/revalidateTag'

/**
 * Unified global hook that handles all revalidations on global changes.
 * Uses collection slug to determine which revalidation logic to apply.
 */
export const revalidateCache: GlobalBeforeChangeHook = async ({ global, data, context }) => {
  if (context.isSeed) return
  const slug = global.slug
  const draft = data?._status === 'draft'

  switch (slug) {
    case 'siteMetaData':
      await revalidateTag('site-metadata', draft)
      break
    case 'tracking':
      await revalidateTag('tracking', draft)
      break
    case 'settings':
      await revalidateTag('settings', draft)
      break
    default:
      break
  }
}
