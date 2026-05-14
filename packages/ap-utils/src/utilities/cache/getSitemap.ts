'use server'
import 'server-only' //DO NOT REMOVE
import { getPayload, Where } from 'payload'
import type { GCFunction } from '@pro-laico/atomic-payload-types'
import cacheLogger from '../cacheLogger'
import { getServerSideURL } from '../getURL'

/** Gets the pages stored in payload and formats them into a sitemap array. */
export const getCachedSitemap: GCFunction<'sitemap'> = async (configPromise, tag, draft) => {
  const payload = await getPayload({ config: configPromise })
  const where: Where = { href: { exists: true } }
  if (!draft) Object.assign(where, { live: { equals: true }, 'meta.noIndex': { equals: false } })
  const results = await payload.find({
    collection: 'pages',
    draft,
    where,
    depth: 0,
    limit: 0,
    overrideAccess: draft,
    select: { href: true, updatedAt: true, meta: { priority: true, noIndex: true, changeFrequency: true } },
  })

  type SitemapDoc = {
    href?: string | null
    updatedAt?: string | null
    meta?: { priority?: number | null; noIndex?: boolean | null; changeFrequency?: 'yearly' | 'monthly' | 'weekly' | 'daily' | 'hourly' | 'never' | null } | null
  }
  const pages = (results.docs as SitemapDoc[]) || []
  const pagesWithout404 = pages.filter(({ href }) => href !== '/404') // Exclude 404 page
  const dateFallback = new Date().toISOString()

  const sitemap = pagesWithout404
    ? pagesWithout404.map((page) => {
        const { href, updatedAt, meta } = page
        if (href === '/') {
          return {
            priority: 1,
            url: `${getServerSideURL()}`,
            lastModified: updatedAt || dateFallback,
            changeFrequency: meta?.changeFrequency || 'monthly',
          } as const
        }
        return {
          priority: meta?.priority || 0.5,
          url: `${getServerSideURL()}${href}`,
          lastModified: updatedAt || dateFallback,
          changeFrequency: meta?.changeFrequency || 'monthly',
        } as const
      })
    : []

  cacheLogger({ tag, draft })
  return sitemap
}
