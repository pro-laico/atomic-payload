import type { Config, Plugin } from 'payload'

import { revalidateCache as collectionRevalidate, revalidateCacheOnDelete } from './hooks/collection/revalidate'
import { revalidateCache as globalRevalidate } from './hooks/global/revalidate'

export interface RevalidationPluginOptions {
  /** When false, the plugin is a no-op. Defaults to true. */
  enabled?: boolean
  /** Collection slugs to attach the beforeChange revalidate hook to. */
  collectionSlugs?: string[]
  /** Collection slugs to attach the afterDelete revalidate hook to. */
  deleteCollectionSlugs?: string[]
  /** Global slugs to attach the beforeChange revalidate hook to. */
  globalSlugs?: string[]
}

/**
 * Payload plugin that wires the unified collection + global revalidation hooks
 * to the slugs supplied in the options.
 */
export const revalidationPlugin =
  (opts: RevalidationPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, collectionSlugs = [], deleteCollectionSlugs = [], globalSlugs = [] } = opts
    if (!enabled) return config

    const collections = (config.collections ?? []).map((collection) => {
      const next = { ...collection }
      const hooks = { ...(next.hooks ?? {}) }
      if (collectionSlugs.includes(collection.slug)) {
        hooks.beforeChange = [...(hooks.beforeChange ?? []), collectionRevalidate]
      }
      if (deleteCollectionSlugs.includes(collection.slug)) {
        hooks.afterDelete = [...(hooks.afterDelete ?? []), revalidateCacheOnDelete]
      }
      next.hooks = hooks
      return next
    })

    const globals = (config.globals ?? []).map((global) => {
      if (!globalSlugs.includes(global.slug)) return global
      const next = { ...global }
      const hooks = { ...(next.hooks ?? {}) }
      hooks.beforeChange = [...(hooks.beforeChange ?? []), globalRevalidate]
      next.hooks = hooks
      return next
    })

    return { ...config, collections, globals }
  }

export default revalidationPlugin
