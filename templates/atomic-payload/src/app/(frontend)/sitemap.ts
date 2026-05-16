'use server'
import type { MetadataRoute } from 'next'
import getCached from '@pro-laico/core/cache/auto'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const sitemap = await getCached('sitemap', false)
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
