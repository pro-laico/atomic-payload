import { Images } from '@/collections/images'
import { blurDataUrlsPlugin } from '@oversightstudio/blur-data-urls'

export const blurDataUrlsPluginConfig = blurDataUrlsPlugin({
  enabled: true,
  collections: [Images],
  blurOptions: { blur: 18, width: 32, height: 'auto' },
})
