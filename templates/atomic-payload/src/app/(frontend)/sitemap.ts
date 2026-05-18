'use server'
import getCached from '@pro-laico/core/cache/auto'
import type { MetadataRoute } from 'next'

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
