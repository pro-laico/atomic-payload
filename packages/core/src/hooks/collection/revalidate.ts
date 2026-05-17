import { revalidateTag } from '../../utilities/revalidateTag'
import type { CollectionBeforeChangeHook, CollectionAfterDeleteHook } from 'payload'

/** Args passed to per-slug `beforeChange` revalidation handlers. `data` and
 *  `originalDoc` are typed as `any` so handlers can reach into collection-specific
 *  fields without per-slug typing — they receive the raw shapes Payload passes to
 *  `beforeChange`. */
export type RevalidationContext = {
  data: any
  originalDoc: any
  draft: boolean
  active: boolean
}

/** Map of collection slug → handler that runs that collection's beforeChange revalidations. */
export type CollectionRevalidationHandlers = Record<string, (ctx: RevalidationContext) => Promise<void> | void>

/** Args passed to per-slug `afterDelete` revalidation handlers. */
export type DeleteRevalidationContext = {
  doc: any
}

export type CollectionDeleteRevalidationHandlers = Record<string, (ctx: DeleteRevalidationContext) => Promise<void> | void>

/** Builds a `CollectionBeforeChangeHook` that dispatches to a per-slug handler. */
export const createRevalidateCache =
  (handlers: CollectionRevalidationHandlers): CollectionBeforeChangeHook =>
  async ({ collection, data, originalDoc, context }) => {
    if (context.isSeed) return
    const handler = handlers[collection.slug]
    if (!handler) return
    await handler({
      data,
      originalDoc,
      draft: data?._status === 'draft',
      active: Boolean(data?.active),
    })
  }

/** Builds a `CollectionAfterDeleteHook` that dispatches to a per-slug handler. */
export const createRevalidateCacheOnDelete =
  (handlers: CollectionDeleteRevalidationHandlers): CollectionAfterDeleteHook =>
  async ({ collection, doc }) => {
    const handler = handlers[collection.slug]
    if (!handler) return
    await handler({ doc })
  }

/** Default `beforeChange` handlers — match the atomic-payload template's collection set. Override by calling `createRevalidateCache` directly. */
export const DEFAULT_REVALIDATION_HANDLERS: CollectionRevalidationHandlers = {
  iconSet: async ({ active, draft }) => {
    if (active) await revalidateTag('iconSet', draft)
  },
  forms: async ({ data }) => {
    await revalidateTag('backend-forms')
    await revalidateTag('form-submissions', data?.title)
  },
  'form-submissions': async ({ data }) => {
    await revalidateTag('form-submissions', data?.form)
  },
  images: async ({ originalDoc }) => {
    await revalidateTag('image', originalDoc?.id)
  },
  icon: async ({ originalDoc, draft }) => {
    await revalidateTag('icon', originalDoc?.id, draft)
  },
}

/** Default `afterDelete` handlers — match the atomic-payload template's collection set. */
export const DEFAULT_DELETE_REVALIDATION_HANDLERS: CollectionDeleteRevalidationHandlers = {
  footer: async ({ doc }) => {
    if (Boolean(doc?.active)) await revalidateTag('footer', false)
  },
  header: async ({ doc }) => {
    if (Boolean(doc?.active)) await revalidateTag('header', false)
  },
  iconSet: async ({ doc }) => {
    if (Boolean(doc?.active)) await revalidateTag('iconSet', false)
  },
  designSet: async ({ doc }) => {
    if (Boolean(doc?.active)) await revalidateTag('designSet', false)
  },
  shortcutSet: async ({ doc }) => {
    if (Boolean(doc?.active)) await revalidateTag('shortcutSet', false)
  },
  pages: ({ doc }) => {
    revalidateTag('pages', false)
    revalidateTag('page', doc?.href, false)
  },
}

/**
 * Unified `beforeChange` hook bound to `DEFAULT_REVALIDATION_HANDLERS`. Use
 * `createRevalidateCache(handlers)` to bind a custom slug → handler map.
 */
export const revalidateCache: CollectionBeforeChangeHook = createRevalidateCache(DEFAULT_REVALIDATION_HANDLERS)

/**
 * Unified `afterDelete` hook bound to `DEFAULT_DELETE_REVALIDATION_HANDLERS`.
 * Use `createRevalidateCacheOnDelete(handlers)` to bind a custom slug → handler map.
 */
export const revalidateCacheOnDelete: CollectionAfterDeleteHook = createRevalidateCacheOnDelete(DEFAULT_DELETE_REVALIDATION_HANDLERS)
