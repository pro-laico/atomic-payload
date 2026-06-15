import type { Plugin } from 'payload'

import { seedPlugin } from '@pro-laico/seed'
import { sitePlugin } from '@pro-laico/site'
import { fontsPlugin } from '@pro-laico/fonts'
import { imagesPlugin } from '@pro-laico/images'
import { revalidationPlugin } from '@pro-laico/core'
import { trackingPlugin } from '@pro-laico/tracking'
import { muxVideoPlugin } from '@pro-laico/mux-video'
import { formsPlugin } from '@pro-laico/atomic/forms'
import { actionsPlugin } from '@pro-laico/atomic/actions'

import { iconsPluginConfig } from './icons'
import { stylesPluginConfig } from './styles'
import { nestedDocsPluginConfig } from './nestedDocs'
import { jsonSchemaPluginConfig } from './jsonSchema'
import { childBlocksPluginConfig } from './childBlocks'
import { formBuilderPluginConfig } from './formBuilder'
import { blurDataUrlsPluginConfig } from './blurDataUrls'
import { vercelBlobStoragePluginConfigs } from './vercelBlobStorage'

// Notes on plugin composition:
// - `Font` is registered via `fontsPlugin`; `Icon` and `iconSet` via `iconsPlugin`
//   (see `./icons`); the `designSet` / `shortcutSet` collections plus the CSS
//   storage globals via `stylesPlugin` (see `./styles`).
// - `sitePlugin` registers the Pages, Header, Footer collections plus the
//   SiteMetaData and Settings globals.
// - `imagesPlugin` registers Images + Favicons; `blurDataUrlsPluginConfig` runs
//   after it so blur fields land on the registered Images collection.
// - `muxVideoPlugin` registers the MuxVideo collection; `trackingPlugin` the
//   `Tracking` global; `seedPlugin` the SEED DATABASE banner + `POST /api/seed`.
// - `formsPlugin` / `actionsPlugin` prepend the default form / action blocks.
//
// Cross-cutting wiring is explicit, no magic finalizer:
// - The shared `atomicHook` (CSS/forms/actions snapshot + single-active) is baked
//   into each atomic-content collection by its own plugin: `sitePlugin` bakes it
//   on pages/header/footer, `stylesPlugin({ atomicHook })` on designSet/shortcutSet
//   (see `./styles`), and `iconsPlugin`'s `iconSetOptions.hooks` on iconSet (see
//   `./icons`).
// - The `@pro-laico/*` collections and globals bake their own cache-revalidation
//   hooks, so the only revalidation left to wire is for the third-party form
//   builder's `forms` / `form-submissions` collections, via `revalidationPlugin`
//   at the end of the array (after `formBuilderPluginConfig` has registered them).

export const plugins: Plugin[] = [
  sitePlugin(),
  jsonSchemaPluginConfig,
  formsPlugin(),
  actionsPlugin(),
  // childBlocksPluginConfig weaves the @pro-laico/styles ClassNameField into the default
  // child blocks via generic prepend/append fields (see ./childBlocks). The block packages
  // (icons/images/mux-video/richtext) no longer depend on @pro-laico/styles themselves.
  childBlocksPluginConfig,
  trackingPlugin(),
  seedPlugin(),
  // Optimize fonts on upload (convert + subset to WOFF2, keep the original, report
  // the size saved). Requires the `subset-font` + `fontkit` optional peer deps and
  // server-side uploads for the `font` collection (see ./vercelBlobStorage).
  fontsPlugin({ optimize: true }),
  imagesPlugin(),
  muxVideoPlugin(),
  iconsPluginConfig,
  stylesPluginConfig,
  nestedDocsPluginConfig,
  formBuilderPluginConfig,
  blurDataUrlsPluginConfig,
  // Two instances: client-side uploads for images/icons/favicons, server-side for
  // fonts (so the optimize-on-upload hook can subset them). See ./vercelBlobStorage.
  ...vercelBlobStoragePluginConfigs,
  // Revalidate the third-party form-builder collections (the @pro-laico/* ones
  // bake their own). Keep this last so the target collections already exist.
  revalidationPlugin({ collectionSlugs: ['forms', 'form-submissions'] }),
]
