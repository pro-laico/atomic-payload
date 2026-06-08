import type { Config, Plugin } from 'payload'

import { Footer } from './collections/footers/collection'
import { Header } from './collections/headers/collection'
import { Pages } from './collections/pages/collection'
import { Settings } from './globals/settings'
import { SiteMetaData } from './globals/siteMetaData'

export interface SitePluginOptions {
  /** When false, the plugin is a no-op. Defaults to true. */
  enabled?: boolean
}

/** Registers the Pages/Header/Footer collections and the SiteMetaData/Settings
 *  globals. The CSS storage globals (`draftStorage` / `publishedStorage`) now
 *  ship with `@pro-laico/styles` (`stylesPlugin`). Cross-package wiring
 *  (atomicHook, nested-docs, live preview URL, jsonSchema) is intentionally
 *  left to the template's plugin-composition layer so the package stays
 *  unopinionated about how those are configured. */
export const sitePlugin =
  (opts: SitePluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true } = opts
    if (!enabled) return config

    return {
      ...config,
      collections: [...(config.collections ?? []), Pages, Header, Footer],
      globals: [...(config.globals ?? []), Settings, SiteMetaData],
    }
  }

export default sitePlugin
