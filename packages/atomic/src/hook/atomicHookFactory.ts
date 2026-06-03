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
const cache = new WeakMap<AtomicHookSlugConfig, CollectionBeforeChangeHook>()

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

export const atomicHookWith = (slugConfig: AtomicHookSlugConfig): CollectionBeforeChangeHook => {
  const cached = cache.get(slugConfig)
  if (cached) return cached
  let inner: CollectionBeforeChangeHook | undefined
  const hook: CollectionBeforeChangeHook = async (args) => {
    if (!inner) inner = await buildHook(slugConfig)
    return inner(args)
  }
  cache.set(slugConfig, hook)
  return hook
}
