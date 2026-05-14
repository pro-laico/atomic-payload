'use server'

import type { CollectionBeforeChangeHook } from 'payload'
import type { AtomicHookGetCached, ActionBlockStorageProcessorClass } from './atomicHookTypes'

/**
 * Ready-made `atomicHook` whose dependencies (`getCached` / UnoCSS via
 * `ap-utils/cache/auto`, and the actions `ActionBlockStorageProcessor`) are
 * dynamically imported on first invocation. This keeps Payload config + zap
 * schema generation from pulling UnoCSS at module-load time.
 *
 * The peer specifiers below are intentionally indirected through variables so
 * TypeScript does not statically resolve them — they are provided by the host
 * project's installed packages at runtime.
 */
let inner: CollectionBeforeChangeHook | undefined

const ACTIONS_PROCESSOR_SPECIFIER = '@pro-laico/atomic-payload-actions/processor'
const CACHE_AUTO_SPECIFIER = '@pro-laico/ap-utils/cache/auto'

export const atomicHook: CollectionBeforeChangeHook = async (args) => {
  if (!inner) {
    const [hookMod, procMod, cacheMod] = await Promise.all([
      import('./createAtomicHook'),
      import(ACTIONS_PROCESSOR_SPECIFIER) as Promise<{ ActionBlockStorageProcessor: ActionBlockStorageProcessorClass }>,
      import(CACHE_AUTO_SPECIFIER) as Promise<{ default: AtomicHookGetCached }>,
    ])
    inner = hookMod.createAtomicHook({
      getCached: cacheMod.default,
      ActionBlockStorageProcessor: procMod.ActionBlockStorageProcessor,
    })
  }
  return inner(args)
}
