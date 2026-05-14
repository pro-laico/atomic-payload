//Plugin Imports
import { Plugin } from 'payload'

//Plugin Configurations
import { muxVideoPluginConfig } from './muxVideo'
import { nestedDocsPluginConfig } from './nestedDocs'
import { formBuilderPluginConfig } from './formBuilder'
import { blurDataUrlsPluginConfig } from './blurDataUrls'
import { vercelBlobStoragePluginConfig } from './vercelBlobStorage'

// Atomic Payload package plugins
import { revalidationPlugin } from '@pro-laico/ap-utils'
import { formsPlugin } from '@pro-laico/atomic-payload-forms'
import { actionsPlugin } from '@pro-laico/atomic-payload-actions'
import { childBlocksPlugin } from '@pro-laico/atomic-payload-child-blocks'
import { trackingPlugin } from '@pro-laico/ap-tracking'
import { seedPlugin } from '@pro-laico/ap-seed'
import { seed } from '@/endpoints/seed'
import { fontsPluginConfig } from './fonts'
import { iconsPluginConfig } from './icons'
import { designSetsPluginConfig } from './designSets'
import { jsonSchemaPluginConfig } from './jsonSchema'

// Notes on plugin composition:
// - `Font` is registered via `fontsPlugin` (see `./fonts`).
// - `Icon` and `iconSet` are registered via `iconsPlugin` (see `./icons`).
// - The `designSet` and `shortcutSet` collections are registered via `designSetsPlugin` (see `./designSets`).
// - `trackingPlugin` registers the `Tracking` global (GTM + PostHog tabs + analytics toggles)
//   and the `posthogProperty` collection — both used to live in the template.
// - `seedPlugin` mounts `POST /api/seed` and the `BeforeDashboard` SEED DATABASE
//   banner. Pass the template's `seed` function; gate it on `INCLUDE_SEED`.
// - Other collections owned by atomic-payload-* packages (Images, Favicons,
//   MuxVideo) are still registered through the template's `@/collections` array;
//   their `imagesPlugin` factories are intentionally not invoked here to avoid
//   double-registration.
// - `formsPlugin` prepends default submit-form blocks; pass `formBlocks: […]` for more.
// - `actionsPlugin` prepends default action blocks; pass `actionBlocks: […]` for more.
// - `revalidationPlugin` attaches beforeChange / afterDelete revalidation hooks
//   to the listed slugs.

export const plugins: Plugin[] = [
  jsonSchemaPluginConfig,
  formsPlugin({ enabled: true }),
  actionsPlugin({ enabled: true }),
  // Pass `childBlocks: [myBlock, …]` to append more blocks alongside the defaults.
  childBlocksPlugin({ enabled: true }),
  trackingPlugin({ enabled: true }),
  seedPlugin({ enabled: process.env.INCLUDE_SEED === 'true', seed }),
  fontsPluginConfig,
  iconsPluginConfig,
  designSetsPluginConfig,
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
