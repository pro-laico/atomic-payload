'use server'

import type { CollectionBeforeChangeHook } from 'payload'
import type { AtomicHookGetCached, AtomicHookSlugConfig } from './atomicHookTypes'

/**
 * Ready-made `atomicHook` whose dependencies (`getCached` / UnoCSS via
 * `ap-utils/cache/auto`, and the actions `ActionBlockStorageProcessor`) are
 * dynamically imported on first invocation. This keeps Payload config + zap
 * schema generation from pulling UnoCSS at module-load time.
 *
 * The default export uses the atomic-payload template's conventional slug
 * names (`pages`, `designSet`, `iconSet`, `draftStorage`, `publishedStorage`).
 * Use `atomicHookWith(slugConfig)` to override per-slug behavior.
 */
const cache = new WeakMap<AtomicHookSlugConfig, CollectionBeforeChangeHook>()
const defaultConfig: AtomicHookSlugConfig = {}
let defaultInner: CollectionBeforeChangeHook | undefined

async function buildHook(slugConfig: AtomicHookSlugConfig): Promise<CollectionBeforeChangeHook> {
  const [hookMod, procMod, cacheMod] = await Promise.all([
    import('./createAtomicHook'),
    import('@pro-laico/atomic/actions/processor'),
    import('@pro-laico/core/cache/auto'),
  ])
  return hookMod.createAtomicHook({
    getCached: cacheMod.default as AtomicHookGetCached,
    ActionBlockStorageProcessor: procMod.ActionBlockStorageProcessor,
    ...slugConfig,
  })
}

export const atomicHook: CollectionBeforeChangeHook = async (args) => {
  if (!defaultInner) defaultInner = await buildHook(defaultConfig)
  return defaultInner(args)
}

/** Factory for `atomicHook` with per-slug overrides; shares the lazy import per config object. */
export const atomicHookWith = (slugConfig: AtomicHookSlugConfig): CollectionBeforeChangeHook => {
  let inner: CollectionBeforeChangeHook | undefined
  const cached = cache.get(slugConfig)
  if (cached) return cached
  const hook: CollectionBeforeChangeHook = async (args) => {
    if (!inner) inner = await buildHook(slugConfig)
    return inner(args)
  }
  cache.set(slugConfig, hook)
  return hook
}
