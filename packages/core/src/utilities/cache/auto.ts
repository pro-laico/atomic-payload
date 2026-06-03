import 'server-only'

import { cache } from 'react'

import type { GetCachedFn } from './getCached'
import { createDefaultGetCached } from './index'
import { getPayloadConfig } from '../../config'

/** Lazily bound on first call so registration (`registerPayloadConfig`) need only
 *  precede the first lookup, not this module's import. */
let bound: GetCachedFn | undefined
const resolve = (): GetCachedFn => (bound ??= createDefaultGetCached(getPayloadConfig()))

/** Per-request memoized `getCached`, bound to the config the host app registered
 *  via `registerPayloadConfig` (`@pro-laico/core/config`). Import this from any
 *  server component / server action to share one `react.cache` instance across
 *  every consumer in a render. */
const getCached = cache(((...args: unknown[]) => (resolve() as (...a: unknown[]) => unknown)(...args)) as unknown as GetCachedFn)

export default getCached
