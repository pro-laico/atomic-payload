'use server'

import type { CollectionBeforeChangeHook } from 'payload'

import type { AtomicHookGetCached } from './atomicHookTypes'

/**
 * Ready-made `atomicHook` whose dependencies (the CSS getter built from
 * `@pro-laico/styles/cache` + `@pro-laico/site/cache`, and the actions
 * `ActionBlockStorageProcessor`) are dynamically imported on first invocation.
 * This keeps Payload config + zap schema generation from pulling UnoCSS at
 * module-load time.
 *
 * This export uses the atomic-payload template's conventional slug names
 * (`pages`, `designSet`, `iconSet`, `draftStorage`, `publishedStorage`). To
 * override per-slug behavior, use `atomicHookWith(slugConfig)` from
 * `./atomicHookFactory`.
 *
 * Note: every export from this file must be an async function — the `'use
 * server'` directive marks the module as a Server Actions module and
 * Next.js's bundler enforces that constraint. Synchronous factories live in
 * `./atomicHookFactory` (no `'use server'`).
 */
let defaultInner: CollectionBeforeChangeHook | undefined

export const atomicHook: CollectionBeforeChangeHook = async (args) => {
  if (!defaultInner) {
    const [hookMod, procMod, stylesCacheMod, siteCacheMod] = await Promise.all([
      import('./createAtomicHook'),
      import('@pro-laico/atomic/actions/processor'),
      import('@pro-laico/styles/cache'),
      import('@pro-laico/site/cache'),
    ])
    defaultInner = hookMod.createAtomicHook({
      getCached: stylesCacheMod.createCssGetCached({
        getHeader: siteCacheMod.getCachedHeader,
        getFooter: siteCacheMod.getCachedFooter,
      }) as AtomicHookGetCached,
      ActionBlockStorageProcessor: procMod.ActionBlockStorageProcessor,
    })
  }
  return defaultInner(args)
}
