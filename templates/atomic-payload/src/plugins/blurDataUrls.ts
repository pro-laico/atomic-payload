import { Images } from '@pro-laico/ap-images'
import { blurDataUrlsPlugin } from '@oversightstudio/blur-data-urls'

// Applied after `imagesPlugin` has registered the Images collection. Lives in
// the template (not in `@pro-laico/ap-images`) because pnpm doesn't hoist
// optional peers next to the package, and Payload plugins must run sync.
export const blurDataUrlsPluginConfig = blurDataUrlsPlugin({
  enabled: true,
  collections: [Images],
  blurOptions: { blur: 18, width: 32, height: 'auto' },
})
