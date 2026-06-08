import type { CollectionBeforeChangeHook, Config, Plugin } from 'payload'

export interface AtomicHookPluginOptions {
  enabled?: boolean
  /** The atomicHook implementation to attach to each listed collection. */
  hook: CollectionBeforeChangeHook
  /** The collection slugs that should have the atomicHook in their `beforeChange` hooks array. */
  collectionSlugs: string[]
}

/** Attaches the provided `atomicHook` to `beforeChange` for each slug. Build the hook via `createAtomicHook` or by calling `atomicHook(slugConfig)`. */
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
