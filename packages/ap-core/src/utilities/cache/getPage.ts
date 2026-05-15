'use server'
import 'server-only' //DO NOT REMOVE
import { getPayload, Where } from 'payload'
import type { GCFunction } from '../../types/cache'
import { manualLogger, sanitizeData } from '@pro-laico/ap-atomic-hook/light'
import cacheLogger from '../cacheLogger'

/** Gets a page by its href. */
export const getCachedPageByHref: GCFunction<'page'> = async (configPromise, tag, tid, draft, pages) => {
  if (!pages.includes(tid)) {
    manualLogger(`[Warning] - Page not found - ${tid}`)
    return
  }
  const payload = await getPayload({ config: configPromise })
  const where: Where = { href: { equals: tid } }
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
