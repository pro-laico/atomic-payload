//Plugin Imports

import { actionsPlugin } from '@pro-laico/atomic/actions'
import { formsPlugin } from '@pro-laico/atomic/forms'
// Atomic Payload package plugins
import { revalidationPlugin } from '@pro-laico/core'
import { seedPlugin } from '@pro-laico/seed'
import { sitePlugin } from '@pro-laico/site'
import { trackingPlugin } from '@pro-laico/tracking'
import type { Plugin } from 'payload'

import { blurDataUrlsPluginConfig } from './blurDataUrls'
import { childBlocksPluginConfig } from './childBlocks'
import { fontsPluginConfig } from './fonts'
import { formBuilderPluginConfig } from './formBuilder'
import { iconsPluginConfig } from './icons'
import { imagesPluginConfig } from './images'
import { jsonSchemaPluginConfig } from './jsonSchema'
//Plugin Configurations
import { muxVideoPluginConfig } from './muxVideo'
import { nestedDocsPluginConfig } from './nestedDocs'
import { stylesPluginConfig } from './styles'
import { vercelBlobStoragePluginConfig } from './vercelBlobStorage'

// Notes on plugin composition:
// - `Font` is registered via `fontsPlugin` (see `./fonts`).
// - `Icon` and `iconSet` are registered via `iconsPlugin` (see `./icons`).
// - The `designSet` and `shortcutSet` collections (each individually toggleable) plus the
//   draftStorage / publishedStorage CSS globals are registered via `stylesPlugin` (see `./designSets`).
// - `trackingPlugin` registers the `Tracking` global (GTM + PostHog tabs + analytics toggles)
//   and the `posthogProperty` collection â€” both used to live in the template.
// - `seedPlugin` mounts `POST /api/seed` and the `BeforeDashboard` SEED DATABASE
//   banner. The bundled atomic-payload seed runs by default; pass `seed: â€¦` to
//   override. Gate registration on `INCLUDE_SEED`.
// - `sitePlugin` registers the Pages, Header, Footer collections plus the
//   SiteMetaData and Settings globals â€” the opinionated "site shape" that used
//   to live in the template. (The CSS storage globals now ship with `stylesPlugin`.)
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
  // childBlocksPluginConfig weaves the @pro-laico/styles ClassNameField into the default
  // child blocks via generic prepend/append fields (see ./childBlocks). The block packages
  // (icons/images/mux-video/richtext) no longer depend on @pro-laico/styles themselves.
  childBlocksPluginConfig,
  trackingPlugin({ enabled: true }),
  seedPlugin({ enabled: process.env.INCLUDE_SEED === 'true' }),
  fontsPluginConfig,
  iconsPluginConfig,
  imagesPluginConfig,
  stylesPluginConfig,
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
