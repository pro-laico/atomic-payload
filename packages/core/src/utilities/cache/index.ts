import 'server-only'
import type { PayloadConfigPromise } from '../../types/cache'
import { createGetCached, type GetRegistry } from './getCached'

import { getCachedPages, createGetCachedPages } from './getPages'
import { getCachedImage } from './getImage'
import { getCachedFooter } from './getFooter'
import { getCachedHeader } from './getHeader'
import { getCachedSiteCSS } from './getSiteCSS'
import { getCachedSitemap, createGetCachedSitemap } from './getSitemap'
import { getCachedPageByHref, createGetCachedPageByHref } from './getPage'
import { getCachedTracking } from './getTracking'
import { getCachedDesignSet } from './getDesignSet'
import { getCachedShortcutSet } from './getShortcutSet'
import { getCachedSiteMetadata } from './getSiteMetadata'
import { getCachedAtomicClasses, createGetCachedAtomicClasses } from './getAtomicClasses'
import { getCachedAtomicActions } from './getAtomicActions'
import { getCachedFormSubmissions } from './getFormSubmissions'
import { getCachedIconByName, getCachedIconSet, getCachedIconOptions } from './getIcon'
import { getCachedAllForms, getCachedAtomicForms, getCachedBackendForms, createGetCachedAtomicForms, createGetCachedBackendForms } from './getForms'

/** Collection-slug configuration for the default getter registry. */
export type DefaultGetRegistryOptions = {
  /** Slug of the pages collection. Defaults to `'pages'`. */
  pagesSlug?: string
  /** Slug of the forms collection. Defaults to `'forms'`. */
  formsSlug?: string
}

/** Build a `GetRegistry` whose page-bound getters target the supplied slugs.
 *  Defaults match the atomic-payload template (`pages`, `forms`). */
export function createDefaultGetRegistry(options: DefaultGetRegistryOptions = {}): GetRegistry {
  const pagesSlug = options.pagesSlug ?? 'pages'
  const formsSlug = options.formsSlug ?? 'forms'
  return {
    pages: createGetCachedPages(pagesSlug),
    image: getCachedImage,
    header: getCachedHeader,
    footer: getCachedFooter,
    page: createGetCachedPageByHref(pagesSlug),
    icon: getCachedIconByName,
    sitemap: createGetCachedSitemap(pagesSlug),
    iconSet: getCachedIconSet,
    tracking: getCachedTracking,
    'site-css': getCachedSiteCSS,
    designSet: getCachedDesignSet,
    'all-forms': getCachedAllForms,
    shortcutSet: getCachedShortcutSet,
    'atomic-forms': createGetCachedAtomicForms(pagesSlug),
    'icon-options': getCachedIconOptions,
    'site-metadata': getCachedSiteMetadata,
    'backend-forms': createGetCachedBackendForms(formsSlug),
    'atomic-classes': createGetCachedAtomicClasses(pagesSlug),
    'atomic-actions': getCachedAtomicActions,
    'form-submissions': getCachedFormSubmissions,
  }
}

/** The registry of stock getter functions shipped by `@pro-laico/core`, bound
 *  to the default `pages` / `forms` slugs. Pass directly to `createGetCached`
 *  for the standard behavior, or call `createDefaultGetRegistry({ pagesSlug, formsSlug })`
 *  to bind different slugs. */
export const defaultGetRegistry: GetRegistry = createDefaultGetRegistry()

/** Build the standard `getCached` server-side function bound to a host project's
 *  Payload `configPromise`. Equivalent to `createGetCached(configPromise, defaultGetRegistry)`. */
export function createDefaultGetCached(configPromise: PayloadConfigPromise, options?: DefaultGetRegistryOptions) {
  const registry = options ? createDefaultGetRegistry(options) : defaultGetRegistry
  return createGetCached(configPromise, registry)
}

export { createGetCached } from './getCached'
export type { GetRegistry, GetCachedFn } from './getCached'

export {
  getCachedPages,
  createGetCachedPages,
  getCachedImage,
  getCachedFooter,
  getCachedHeader,
  getCachedSiteCSS,
  getCachedSitemap,
  createGetCachedSitemap,
  getCachedPageByHref,
  createGetCachedPageByHref,
  getCachedTracking,
  getCachedDesignSet,
  getCachedShortcutSet,
  getCachedSiteMetadata,
  getCachedAtomicClasses,
  createGetCachedAtomicClasses,
  getCachedAtomicActions,
  getCachedFormSubmissions,
  getCachedIconByName,
  getCachedIconSet,
  getCachedIconOptions,
  getCachedAllForms,
  getCachedAtomicForms,
  createGetCachedAtomicForms,
  getCachedBackendForms,
  createGetCachedBackendForms,
}
