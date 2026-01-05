'use server'
import 'server-only' //DO NOT REMOVE
import { getPayload } from 'payload'
import { GCFunction } from '@/ts/types'
import configPromise from '@payload-config'
import cacheLogger from '@/utilities/log/cache'

/** Gets the active design set. */
export const getCachedDesignSet: GCFunction<'designSet'> = async (tag, draft) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({ collection: tag, draft, where: { active: { equals: true } }, limit: 1 }).then((res) => res.docs[0] || null)

  cacheLogger({ tag, draft })
  return result
}
