'use server'
import type { MetadataRoute } from 'next'
import getCached from '@/utilities/get/cache'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap = await getCached({ tag: 'sitemap', draft: false })
  const sitemapEntries = sitemap.map((page) => ({
    url: page.url,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
  return sitemapEntries
}
