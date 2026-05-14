'use server'

import type { CollectionBeforeChangeHook } from 'payload'
import type { AtomicHookGetCached } from '@pro-laico/atomic-payload-atomic-hook'

/** Real hook is created on first run so importing this module does not pull `getCached` / UnoCSS while Payload config + `collections/zap` load. */
let inner: CollectionBeforeChangeHook | undefined

export const atomicHook: CollectionBeforeChangeHook = async (args) => {
  if (!inner) {
    const [hookMod, procMod, cacheMod] = await Promise.all([
      import('@pro-laico/atomic-payload-atomic-hook'),
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
