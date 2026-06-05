import type { CollectionBeforeChangeHook } from 'payload'

import type { AtomicHookGetCached, AtomicHookSlugConfig } from './atomicHookTypes'

/**
 * Factory for `atomicHook` with per-slug overrides. Returns a
 * `CollectionBeforeChangeHook` that lazily imports its dependencies on first
 * invocation (same pattern as the default `atomicHook` export from
 * `./lazyAtomicHook`).
 *
 * This file deliberately does NOT have `'use server'` so the sync factory
 * function itself can be exported — the inner hook returned by the factory is
 * still an async function and runs server-side.
 */
async function buildHook(slugConfig: AtomicHookSlugConfig): Promise<CollectionBeforeChangeHook> {
  const [hookMod, procMod, stylesCacheMod, siteCacheMod] = await Promise.all([
    import('./createAtomicHook'),
    import('@pro-laico/atomic/actions/processor'),
    import('@pro-laico/styles/cache'),
    import('@pro-laico/site/cache'),
  ])
  return hookMod.createAtomicHook({
    getCached: stylesCacheMod.createCssGetCached({
      getHeader: siteCacheMod.getCachedHeader,
      getFooter: siteCacheMod.getCachedFooter,
      cssCacheTagBySlug: slugConfig.cssCacheTagBySlug,
    }) as AtomicHookGetCached,
    ActionBlockStorageProcessor: procMod.ActionBlockStorageProcessor,
    ...slugConfig,
  })
}

export const atomicHookWith = (slugConfig: AtomicHookSlugConfig): CollectionBeforeChangeHook => {
  let inner: CollectionBeforeChangeHook | undefined
  return async (args) => {
    if (!inner) inner = await buildHook(slugConfig)
    return inner(args)
  }
}
