import type { Config, Plugin } from 'payload'

import { Settings } from './globals/settings'
import { SiteMetaData } from './globals/siteMetaData'
import { Pages } from './collections/pages/collection'
import { Footer } from './collections/footers/collection'
import { Header } from './collections/headers/collection'

export type SitePluginOptions = {
  enabled?: boolean
}

/** Registers the Pages/Header/Footer collections and the SiteMetaData/Settings
 *  globals. The CSS storage globals (`draftStorage` / `publishedStorage`) now
 *  ship with `@pro-laico/styles` (`stylesPlugin`). Cross-package wiring
 *  (atomicHook, nested-docs, live preview URL, jsonSchema) is intentionally
 *  left to the template's plugin-composition layer so the package stays
 *  unopinionated about how those are configured. */
export const sitePlugin =
  (options: SitePluginOptions = {}): Plugin =>
  (config: Config): Config => {
    if (options.enabled === false) return config

    config.collections = [...(config.collections ?? []), Pages, Header, Footer]
    config.globals = [...(config.globals ?? []), Settings, SiteMetaData]

    return config
  }

export default sitePlugin
