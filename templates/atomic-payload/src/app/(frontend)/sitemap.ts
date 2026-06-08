'use server'
import type { MetadataRoute } from 'next'

import { getCachedSitemap } from '@pro-laico/site/cache'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const sitemap = await getCachedSitemap(false)
    const sitemapEntries = sitemap.map((page) => ({
      url: page.url,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
    return sitemapEntries
  } catch {
    return []
  }
}
