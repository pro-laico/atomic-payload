'use server'
import 'server-only' //DO NOT REMOVE
import { getPayload } from 'payload'
import { GCFunction } from '@/ts/types'
import configPromise from '@payload-config'
import cacheLogger from '@/utilities/log/cache'

/** Gets tracking settings from payload about posthog, vercel and google tag manager. */
export const getCachedTracking: GCFunction<'tracking'> = async (tag, draft) => {
  const payload = await getPayload({ config: configPromise })
  const results = await payload.findGlobal({ slug: 'tracking', draft })
  cacheLogger({ tag, draft })
  return results
}
