'use server'
import 'server-only' //DO NOT REMOVE
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { GCFunction } from '@/ts/types'
import cacheLogger from '@/utilities/log/cache'

/** Gets all site metadata from the siteMetaData global.*/
export const getCachedSiteMetadata: GCFunction<'site-metadata'> = async (tag, draft) => {
  const payload = await getPayload({ config: configPromise })
  const results = await payload.findGlobal({ slug: 'siteMetaData', draft })
  cacheLogger({ tag, draft })
  return results
}
