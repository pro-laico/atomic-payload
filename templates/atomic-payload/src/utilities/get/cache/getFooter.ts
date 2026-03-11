'use server'
import 'server-only' //DO NOT REMOVE
import { getPayload } from 'payload'
import { GCFunction } from '@/ts/types'
import configPromise from '@payload-config'
import cacheLogger from '@/utilities/log/cache'

/** Gets the active footer. */
export const getCachedFooter: GCFunction<'footer'> = async (tag, draft) => {
  const payload = await getPayload({ config: configPromise })
  const results = await payload
    .find({ draft, collection: tag, limit: 1, pagination: false, where: { active: { equals: true } } })
    .then((res) => res.docs[0])

  cacheLogger({ tag, draft })
  return results
}
