import type { Config, Plugin, CollectionBeforeChangeHook } from 'payload'

export interface AtomicHookPluginOptions {
  enabled?: boolean
  /** The atomicHook implementation to attach to each listed collection. */
  hook: CollectionBeforeChangeHook
  /** The collection slugs that should have the atomicHook in their `beforeChange` hooks array. */
  collectionSlugs: string[]
}

/**
 * Registers a caller-supplied `atomicHook` on every collection slug in
 * `collectionSlugs`. The hook itself currently lives in the consuming template
 * because it directly references the template's ActionBlockStorageProcessor,
 * cssProcessor, processDesignSet, etc. Those processors will move into this
 * package once their template-only dependencies (action blocks, design-set
 * fields) are also extracted.
 */
export const atomicHookPlugin =
  (opts: AtomicHookPluginOptions): Plugin =>
  (config: Config): Config => {
    const { enabled = true, hook, collectionSlugs } = opts
    if (!enabled) return config

    const collections = (config.collections ?? []).map((collection) => {
      if (!collectionSlugs.includes(collection.slug)) return collection
      const next = { ...collection }
      const hooks = { ...(next.hooks ?? {}) }
      hooks.beforeChange = [...(hooks.beforeChange ?? []), hook]
      next.hooks = hooks
      return next
    })

    return { ...config, collections }
  }

export default atomicHookPlugin
