import 'server-only' //DO NOT REMOVE

import { cache } from 'react'

import { createDefaultGetCached } from './index'
import type { PayloadConfigPromise } from '../../types/cache'

/** Builds a per-request memoized `getCached` (via `react.cache`) bound to the
 *  host project's Payload `configPromise`. Use this in server components when
 *  the same tag may be requested multiple times within a single render. */
export function createReactCachedGetCached(configPromise: PayloadConfigPromise) {
  return cache(createDefaultGetCached(configPromise))
}
