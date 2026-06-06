import type { Plugin } from 'payload'

import { seedPlugin } from '@pro-laico/seed'
import { sitePlugin } from '@pro-laico/site'
import { fontsPlugin } from '@pro-laico/fonts'
import { imagesPlugin } from '@pro-laico/images'
import { pluginComposer } from '@pro-laico/core'
import { atomicHook } from '@pro-laico/atomic/hook'
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
import { vercelBlobStoragePluginConfig } from './vercelBlobStorage'

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
// - `pluginComposer` returns every plugin below followed by a finalizer that runs
//   LAST: it attaches the shared `atomicHook` to the atomic-content collections
//   (designSet, shortcutSet, pages, header, footer, iconSet) and the revalidation
//   dispatchers to every collection and global. Running last, it also wires the
//   `forms` / `form-submissions` collections that `formBuilderPluginConfig`
//   registers, so there are no slug arrays to keep in sync.

export const plugins: Plugin[] = pluginComposer({
  atomicHook,
  plugins: [
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
    fontsPlugin(),
    imagesPlugin(),
    muxVideoPlugin(),
    iconsPluginConfig,
    stylesPluginConfig,
    nestedDocsPluginConfig,
    formBuilderPluginConfig,
    blurDataUrlsPluginConfig,
    vercelBlobStoragePluginConfig,
  ],
})
