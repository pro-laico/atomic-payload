'use server'
import 'server-only' //DO NOT REMOVE
import { getPayload } from 'payload'
import type { GCFunction } from '@pro-laico/ap-types'
import cacheLogger from '../cacheLogger'

/** Gets tracking settings from payload about posthog, vercel and google tag manager. */
export const getCachedTracking: GCFunction<'tracking'> = async (configPromise, tag, draft) => {
  const payload = await getPayload({ config: configPromise })
  const results = await payload.findGlobal({ slug: 'tracking', draft })
  cacheLogger({ tag, draft })
  return results
}
