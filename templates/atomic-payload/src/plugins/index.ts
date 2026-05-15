//Plugin Imports
import { Plugin } from 'payload'

//Plugin Configurations
import { muxVideoPluginConfig } from './muxVideo'
import { nestedDocsPluginConfig } from './nestedDocs'
import { formBuilderPluginConfig } from './formBuilder'
import { blurDataUrlsPluginConfig } from './blurDataUrls'
import { vercelBlobStoragePluginConfig } from './vercelBlobStorage'

// Atomic Payload package plugins
import { revalidationPlugin } from '@pro-laico/ap-core'
import { formsPlugin } from '@pro-laico/ap-forms'
import { actionsPlugin } from '@pro-laico/ap-actions'
import { childBlocksPlugin } from '@pro-laico/children'
import { trackingPlugin } from '@pro-laico/ap-tracking'
import { seedPlugin } from '@pro-laico/ap-seed'
import { sitePlugin } from '@pro-laico/ap-site'
import { fontsPluginConfig } from './fonts'
import { iconsPluginConfig } from './icons'
import { imagesPluginConfig } from './images'
import { designSetsPluginConfig } from './designSets'
import { jsonSchemaPluginConfig } from './jsonSchema'

// Notes on plugin composition:
// - `Font` is registered via `fontsPlugin` (see `./fonts`).
// - `Icon` and `iconSet` are registered via `iconsPlugin` (see `./icons`).
// - The `designSet` and `shortcutSet` collections are registered via `designSetsPlugin` (see `./designSets`).
// - `trackingPlugin` registers the `Tracking` global (GTM + PostHog tabs + analytics toggles)
//   and the `posthogProperty` collection â€” both used to live in the template.
// - `seedPlugin` mounts `POST /api/seed` and the `BeforeDashboard` SEED DATABASE
//   banner. The bundled atomic-payload seed runs by default; pass `seed: â€¦` to
//   override. Gate registration on `INCLUDE_SEED`.
// - `sitePlugin` registers the Pages, Header, Footer collections plus the
//   SiteMetaData, Settings, draftStorage, publishedStorage globals â€” the
//   opinionated "site shape" that used to live in the template.
// - `imagesPlugin` registers the Images and Favicons collections.
//   `blurDataUrlsPluginConfig` (see `./blurDataUrls`) is applied separately
//   *after* it so blur fields land on the registered Images collection.
// - `muxVideoPlugin` registers the MuxVideo extension collection and applies
//   `@oversightstudio/mux-video`'s upstream plugin to it.
// - `formsPlugin` prepends default submit-form blocks; pass `formBlocks: [â€¦]` for more.
// - `actionsPlugin` prepends default action blocks; pass `actionBlocks: [â€¦]` for more.
// - `revalidationPlugin` attaches beforeChange / afterDelete revalidation hooks
//   to the listed slugs.

export const plugins: Plugin[] = [
  sitePlugin({ enabled: true }),
  jsonSchemaPluginConfig,
  formsPlugin({ enabled: true }),
  actionsPlugin({ enabled: true }),
  // Pass `childBlocks: [myBlock, â€¦]` to append more blocks alongside the defaults.
  childBlocksPlugin({ enabled: true }),
  trackingPlugin({ enabled: true }),
  seedPlugin({ enabled: process.env.INCLUDE_SEED === 'true' }),
  fontsPluginConfig,
  iconsPluginConfig,
  imagesPluginConfig,
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
