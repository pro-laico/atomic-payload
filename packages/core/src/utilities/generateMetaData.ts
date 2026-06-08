import type { Metadata } from 'next'

/** Minimal shape shared by Image and Favicon media docs — enough to pull a URL.
 *  Favicons carry only `url` (no `og` size), so `sizes` is optional. */
type MediaUrlSource = { url?: string | null; sizes?: { og?: { url?: string | null } | null } | null }

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

type GenerateMetaDataArgs = { page?: PageMetaSlice; siteMetadata?: SiteMetaSlice }
type GenerateMetaDataFn = (args: GenerateMetaDataArgs) => Metadata

const processImageUrl = (image: MediaUrlSource | string | null | undefined): string | undefined => {
  if (!image || typeof image === 'string') return
  const url = image.sizes?.og?.url || image.url
  return url || undefined
}

/** Gets the page metadata for a given page and site metadata. Returns a finished Metadata object. */
export const GenerateMetaData: GenerateMetaDataFn = ({ page, siteMetadata }) => {
  const { title, description, image, lightFavicon, darkFavicon, noIndex } = page?.meta || {}
  const { siteName, fallbackOGImage, fallbackLightFavicon, fallbackDarkFavicon, fallbackSiteDescription } = siteMetadata || {}

  const imageUrl = processImageUrl(image)
  const darkFaviconUrl = processImageUrl(darkFavicon)
  const lightFaviconUrl = processImageUrl(lightFavicon)
  const fallbackOGImageUrl = processImageUrl(fallbackOGImage)
  const fallbackDarkFaviconUrl = processImageUrl(fallbackDarkFavicon)
  const fallbackLightFaviconUrl = processImageUrl(fallbackLightFavicon)

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
