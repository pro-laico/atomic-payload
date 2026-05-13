import { APField } from '@pro-laico/atomic-payload-apf'
import type { GlobalConfig } from 'payload'
import { authd } from '@/access/authenticated'
import { FaviconField } from '@pro-laico/atomic-payload-images'
import { onUploadSetAPF } from '@pro-laico/atomic-payload-apf'
import { generateAPFFields } from '@pro-laico/atomic-payload-apf'
import { revalidateCacheGlobal as revalidateCache } from '@pro-laico/atomic-payload-revalidation'

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
