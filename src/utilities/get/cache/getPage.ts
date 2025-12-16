'use server'
import 'server-only' //DO NOT REMOVE
import { getPayload } from 'payload'
import { GCFunction } from '@/ts/types'
import configPromise from '@payload-config'
import cacheLogger from '@/utilities/log/cache'
import manualLogger from '@/utilities/log/manual'
import sanitizeData from '@/utilities/sanitizeData'

/** Gets a page by its href. */
export const getCachedPageByHref: GCFunction<'page'> = async ({ tag, draft, tid, pages }) => {
  if (!pages.includes(tid)) {
    manualLogger(`[Warning] - Page not found - ${tid}`)
    return
  }
  const payload = await getPayload({ config: configPromise })
  const where = { href: { equals: tid } }
  if (!draft) Object.assign(where, { live: { equals: true } })
  const results = await payload
    .find({
      collection: 'pages',
      draft,
      where,
      limit: 1,
      depth: 1000,
      pagination: false,
      overrideAccess: draft,
      select: { meta: true, children: true, mainClassName: true },
    })
    .then((res) => res.docs?.[0] || null)
    .then((res) => sanitizeData(res))

  cacheLogger({ tag, tid, draft })
  return results
}
