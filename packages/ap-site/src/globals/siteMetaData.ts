import { APField, generateAPFFields, onUploadSetAPF } from '@pro-laico/ap-apf'
import type { GlobalConfig } from 'payload'
import { authd, revalidateCacheGlobal as revalidateCache } from '@pro-laico/ap-utils'
import { FaviconField } from '@pro-laico/ap-images'

export const SiteMetaData: GlobalConfig = {
  slug: 'siteMetaData',
  label: 'Site MetaData',
  admin: { group: 'Website' },
  access: { read: authd, update: authd },
  fields: [
    APField({ type: 'text', apf: ['siteMetadata'], name: 'siteName' }),
    APField({ type: 'textarea', apf: ['siteMetadata'], name: 'fallbackSiteDescription' }),
    { type: 'upload', name: 'fallbackOGImage', relationTo: 'images', hooks: { afterChange: [onUploadSetAPF(['siteMetadata'])] } },
    {
      type: 'row',
      fields: [
        FaviconField({ apf: ['siteMetadata'], name: 'fallbackLightFavicon' }),
        FaviconField({ apf: ['siteMetadata'], name: 'fallbackDarkFavicon' }),
      ],
    },
    ...generateAPFFields(['siteMetadata']),
  ],
  hooks: { beforeChange: [revalidateCache] },
  versions: { drafts: { schedulePublish: true, validate: true }, max: 10 },
}
