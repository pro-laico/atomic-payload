'use server'
import 'server-only' //DO NOT REMOVE
import { getPayload } from 'payload'
import { GCFunction } from '@/ts/types'
import configPromise from '@payload-config'
import cacheLogger from '@/utilities/log/cache'

/** Gets all pages set in the pages collection and returns them as an array of strings. */
export const getCachedPages: GCFunction<'pages'> = async ({ tag, draft }) => {
  const payload = await getPayload({ config: configPromise })
  const where = { href: { exists: true } }
  if (!draft) Object.assign(where, { live: { equals: true } })
  const result = await payload.find({
    collection: 'pages',
    draft,
    where,
    limit: 0,
    overrideAccess: draft,
    select: { href: true },
  })
  const returns = result.docs?.map(({ href }) => href).filter((href) => href != null) || []
  cacheLogger({ tag, draft })
  return returns
}
