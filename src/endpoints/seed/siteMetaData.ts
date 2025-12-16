import { SiteMetaDatum } from '@/ts/types'

export const siteMetaData: Omit<SiteMetaDatum, 'createdAt' | 'updatedAt' | 'id'> = {
  siteName: 'Atomic Payload',
  fallbackSiteDescription: 'The open source website builder, where all you need to know is tailwind.',
  fallbackOGImage: null,
  fallbackLightFavicon: null,
  fallbackDarkFavicon: null,
  _status: 'published',
}
