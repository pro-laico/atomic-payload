'use server'

import type { CollectionBeforeChangeHook } from 'payload'
import type { AtomicHookGetCached } from './atomicHookTypes'

/**
 * Ready-made `atomicHook` whose dependencies (`getCached` / UnoCSS via
 * `ap-utils/cache/auto`, and the actions `ActionBlockStorageProcessor`) are
 * dynamically imported on first invocation. This keeps Payload config + zap
 * schema generation from pulling UnoCSS at module-load time.
 */
let inner: CollectionBeforeChangeHook | undefined

export const atomicHook: CollectionBeforeChangeHook = async (args) => {
  if (!inner) {
    const [hookMod, procMod, cacheMod] = await Promise.all([
      import('./createAtomicHook'),
      import('@pro-laico/atomic-payload-actions/processor'),
      import('@pro-laico/ap-utils/cache/auto'),
    ])
    inner = hookMod.createAtomicHook({
      getCached: cacheMod.default as AtomicHookGetCached,
      ActionBlockStorageProcessor: procMod.ActionBlockStorageProcessor,
    })
  }
  return inner(args)
}
