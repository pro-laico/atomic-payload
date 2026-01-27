import { Metadata } from 'next'
import { PageReturn, SiteMetaDatum, Image } from '@/ts/types'

type GenerateMetaDataArgs = { page?: PageReturn; siteMetadata?: SiteMetaDatum }
type GenerateMetaData = (args: GenerateMetaDataArgs) => Metadata

const processImageUrl = (image: Image | string | null | undefined): string | undefined => {
  if (!image || typeof image === 'string') return
  const url = image.sizes?.og?.url || image.url
  return url || undefined
}

/** Gets the page metadata for a given page and site metadata. Returns a finished Metadata object.*/
export const GenerateMetaData: GenerateMetaData = ({ page, siteMetadata }) => {
  const { siteName, fallbackOGImage, fallbackLightFavicon, fallbackDarkFavicon, fallbackSiteDescription } = siteMetadata || {}
  const { title, description, image, lightFavicon, darkFavicon, noIndex } = page?.meta || {}

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

  const result = { ...metadata, icons }
  return result
}
