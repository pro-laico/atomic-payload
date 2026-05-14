import { SiteMetaDatum } from '@pro-laico/atomic-payload-types/schema'

export const siteMetaData: Omit<SiteMetaDatum, 'createdAt' | 'updatedAt' | 'id'> = {
  siteName: 'Atomic Payload',
  fallbackSiteDescription: 'The Website Builder Where All You Need To Know Is Tailwind.',
  fallbackOGImage: null,
  fallbackLightFavicon: null,
  fallbackDarkFavicon: null,
  _status: 'published',
}
