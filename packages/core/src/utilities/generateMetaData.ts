import type { Metadata } from 'next'

import { getServerSideURL } from './getURL'

/** Minimal shape shared by Image and Favicon media docs — enough to pull a URL.
 *  Images may be a populated doc (with `id`) or a bare id string; favicons carry
 *  only `url`. */
type MediaUrlSource = { id?: string | number | null; url?: string | null; sizes?: { og?: { url?: string | null } | null } | null }

/** The page-meta slice this reads. Structural (duck-typed) so `@pro-laico/core`
 *  needs no dependency on `@pro-laico/site`'s `Page` type — a host passes its
 *  own page object and it just has to carry these fields. */
type PageMetaSlice = {
  meta?: {
    title?: string | null
    description?: string | null
    noIndex?: boolean | null
    image?: MediaUrlSource | string | null
    lightFavicon?: MediaUrlSource | string | null
    darkFavicon?: MediaUrlSource | string | null
  } | null
}

/** The site-metadata slice this reads (structural, same rationale as above). */
type SiteMetaSlice = {
  siteName?: string | null
  fallbackSiteDescription?: string | null
  fallbackOGImage?: MediaUrlSource | string | null
  fallbackLightFavicon?: MediaUrlSource | string | null
  fallbackDarkFavicon?: MediaUrlSource | string | null
}

type GenerateMetaDataArgs = {
  page?: PageMetaSlice
  siteMetadata?: SiteMetaSlice
  /** Transform endpoint base path for OG images. Default `/api/img`; pass this if you set `imagesPlugin`'s `transform.path`. */
  transformPath?: string
}
type GenerateMetaDataFn = (args: GenerateMetaDataArgs) => Metadata

/** Default `/api` + the images plugin's default `/img` endpoint base. Keep in sync with `transform.path`. */
const DEFAULT_TRANSFORM_API_PATH = '/api/img'

/** Ensure a relative URL is absolute (crawlers need absolute OG/icon URLs). */
const absolute = (url: string | null | undefined): string | undefined => {
  if (!url) return undefined
  return /^https?:\/\//i.test(url) ? url : `${getServerSideURL()}${url}`
}

/**
 * Resolve a social/OG image URL. Images are served on demand, so prefer an
 * absolute 1200×630 transform URL built from the image id; fall back to any stored
 * `og` size / original for non-`images` sources. The `image` here comes from a page's
 * `meta.image` (related to the images collection), so an `id` implies an images doc.
 */
const ogImageUrl = (image: MediaUrlSource | string | null | undefined, transformPath: string): string | undefined => {
  if (!image) return undefined
  const ogTransform = (id: string | number) => `${getServerSideURL()}${transformPath}/${id}?w=1200&h=630&fit=cover&fmt=jpeg`
  if (typeof image === 'string') return ogTransform(image)
  if (image.id != null) return ogTransform(image.id)
  return absolute(image.sizes?.og?.url || image.url || undefined)
}

/** Resolve a favicon URL (no transform — favicons aren't served by the image endpoint). */
const faviconUrl = (favicon: MediaUrlSource | string | null | undefined): string | undefined => {
  if (!favicon || typeof favicon === 'string') return undefined
  return absolute(favicon.sizes?.og?.url || favicon.url || undefined)
}

/** Gets the page metadata for a given page and site metadata. Returns a finished Metadata object. */
export const GenerateMetaData: GenerateMetaDataFn = ({ page, siteMetadata, transformPath = DEFAULT_TRANSFORM_API_PATH }) => {
  const { title, description, image, lightFavicon, darkFavicon, noIndex } = page?.meta || {}
  const { siteName, fallbackOGImage, fallbackLightFavicon, fallbackDarkFavicon, fallbackSiteDescription } = siteMetadata || {}

  const imageUrl = ogImageUrl(image, transformPath)
  const darkFaviconUrl = faviconUrl(darkFavicon)
  const lightFaviconUrl = faviconUrl(lightFavicon)
  const fallbackOGImageUrl = ogImageUrl(fallbackOGImage, transformPath)
  const fallbackDarkFaviconUrl = faviconUrl(fallbackDarkFavicon)
  const fallbackLightFaviconUrl = faviconUrl(fallbackLightFavicon)

  const metadata: Metadata = {
    title: title || siteName || 'Atomic Payload',
    robots: page ? (noIndex ? 'noindex' : 'index, follow') : 'noindex',
    description: description || fallbackSiteDescription || '',
    openGraph: {
      siteName: siteName || 'Atomic Payload',
      images: imageUrl || fallbackOGImageUrl || undefined,
      description: description || fallbackSiteDescription || '',
    },
  }

  const icons: Metadata['icons'] = []

  if (lightFaviconUrl) icons.push({ url: lightFaviconUrl })
  if (darkFaviconUrl) icons.push({ url: darkFaviconUrl, media: '(prefers-color-scheme: dark)' })
  if (fallbackLightFaviconUrl && !lightFaviconUrl) icons.push({ url: fallbackLightFaviconUrl })
  if (fallbackDarkFaviconUrl && !darkFaviconUrl) icons.push({ url: fallbackDarkFaviconUrl, media: '(prefers-color-scheme: dark)' })

  return { ...metadata, icons }
}
