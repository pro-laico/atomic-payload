'use server'
import 'server-only' //DO NOT REMOVE
import { getPayload } from 'payload'
import { GCFunction } from '@/ts/types'
import configPromise from '@payload-config'
import cacheLogger from '@/utilities/log/cache'

/** Grabs all atomic classes stored in the pages collection. */
export const getCachedAtomicClasses: GCFunction<'atomic-classes'> = async ({ tag, draft }) => {
  const payload = await getPayload({ config: configPromise })
  const where = { storedAtomicClasses: { exists: true } }
  if (!draft) Object.assign(where, { live: { equals: true } })
  const result = await payload
    .find({
      draft,
      where,
      limit: 0,
      depth: 1,
      pagination: false,
      collection: 'pages',
      select: { storedAtomicClasses: true },
    })
    .then((res) =>
      res.docs
        ?.map(({ storedAtomicClasses }) => storedAtomicClasses)
        .filter((arr): arr is string[] => Array.isArray(arr))
        .flat(),
    )

  cacheLogger({ tag, draft })
  return result
}
