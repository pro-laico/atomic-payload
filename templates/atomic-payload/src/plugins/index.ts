//Plugin Imports
import { Plugin } from 'payload'

//Plugin Configurations
import { muxVideoPluginConfig } from './muxVideo'
import { nestedDocsPluginConfig } from './nestedDocs'
import { formBuilderPluginConfig } from './formBuilder'
import { blurDataUrlsPluginConfig } from './blurDataUrls'
import { vercelBlobStoragePluginConfig } from './vercelBlobStorage'

// Atomic Payload package plugins
import { revalidationPlugin } from '@pro-laico/atomic-payload-revalidation'
import { actionsPlugin } from '@pro-laico/atomic-payload-actions'
import { childBlocksPlugin } from '@pro-laico/atomic-payload-child-blocks'

// Notes on plugin composition:
// - Collections owned by atomic-payload-* packages (Icon, Images, Favicons,
//   Font, MuxVideo, PostHogProperty) are still registered through the
//   template's `@/collections` array; their package plugin factories
//   (`iconsPlugin`, `imagesPlugin`, `fontsPlugin`, `posthogPlugin`) are
//   intentionally not invoked here to avoid double-registration. Projects
//   that opt out of the template's `@/collections` aggregator can swap to the
//   plugin factories directly.
// - `actionsPlugin` prepends default action blocks; pass `actionBlocks: […]` for more.
// - `revalidationPlugin` attaches beforeChange / afterDelete revalidation hooks
//   to the listed slugs.

export const plugins: Plugin[] = [
  actionsPlugin({ enabled: true }),
  // Pass `childBlocks: [myBlock, …]` to append more blocks alongside the defaults.
  childBlocksPlugin({ enabled: true }),
  revalidationPlugin({
    enabled: true,
    collectionSlugs: ['icon', 'iconSet', 'images', 'forms', 'form-submissions'],
    deleteCollectionSlugs: ['header', 'footer', 'iconSet', 'designSet', 'shortcutSet', 'pages'],
    globalSlugs: ['siteMetaData', 'tracking', 'settings'],
  }),
  muxVideoPluginConfig,
  nestedDocsPluginConfig,
  formBuilderPluginConfig,
  blurDataUrlsPluginConfig,
  vercelBlobStoragePluginConfig,
]
