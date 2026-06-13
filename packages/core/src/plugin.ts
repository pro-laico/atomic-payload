import type { Config, Plugin } from 'payload'

import { revalidateCacheAfterChange as globalRevalidate } from './hooks/global/revalidate'
import { revalidateCacheCollectionAfterChange as collectionRevalidate, revalidateCacheOnDelete } from './hooks/collection/revalidate'

export interface RevalidationPluginOptions {
  /** When false, the plugin is a no-op. Defaults to true. */
  enabled?: boolean
  /** Collection slugs to attach the afterChange revalidate hook to. */
  collectionSlugs?: string[]
  /** Collection slugs to attach the afterDelete revalidate hook to. */
  deleteCollectionSlugs?: string[]
  /** Global slugs to attach the afterChange revalidate hook to. */
  globalSlugs?: string[]
}

/**
 * Payload plugin that wires the unified collection + global revalidation hooks
 * to the slugs supplied in the options. Use it for collections a third-party
 * plugin registers (e.g. `@payloadcms/plugin-form-builder`'s `forms` /
 * `form-submissions`) — the `@pro-laico/*` plugins bake these hooks into their
 * own collections and globals already, so they need no wiring here. Place it
 * AFTER the plugin that registers the target slugs in your `plugins` array.
 *
 * Hooks attach to `afterChange` (post-commit), not `beforeChange`: busting the
 * cache before the write commits lets a concurrent read re-cache the OLD
 * document. The dispatchers self-select by slug and no-op when no handler
 * matches, so listing a slug with no registered handler is harmless.
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
        hooks.afterChange = [...(hooks.afterChange ?? []), collectionRevalidate]
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
      hooks.afterChange = [...(hooks.afterChange ?? []), globalRevalidate]
      next.hooks = hooks
      return next
    })

    return { ...config, collections, globals }
  }

export default revalidationPlugin
