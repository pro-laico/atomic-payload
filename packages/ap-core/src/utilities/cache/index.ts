import 'server-only'
import type { PayloadConfigPromise } from '../../types/cache'
import { createGetCached, type GetRegistry } from './getCached'

import { getCachedPages } from './getPages'
import { getCachedImage } from './getImage'
import { getCachedFooter } from './getFooter'
import { getCachedHeader } from './getHeader'
import { getCachedSiteCSS } from './getSiteCSS'
import { getCachedSitemap } from './getSitemap'
import { getCachedPageByHref } from './getPage'
import { getCachedTracking } from './getTracking'
import { getCachedDesignSet } from './getDesignSet'
import { getCachedShortcutSet } from './getShortcutSet'
import { getCachedSiteMetadata } from './getSiteMetadata'
import { getCachedAtomicClasses } from './getAtomicClasses'
import { getCachedAtomicActions } from './getAtomicActions'
import { getCachedFormSubmissions } from './getFormSubmissions'
import { getCachedIconByName, getCachedIconSet, getCachedIconOptions } from './getIcon'
import { getCachedAllForms, getCachedAtomicForms, getCachedBackendForms } from './getForms'

/** The registry of stock getter functions shipped by `@pro-laico/ap-core`.
 *  Consumers can pass this directly to `createGetCached` to get the standard
 *  Atomic Payload caching behavior, or compose a partial set with their own
 *  getters for project-specific tags. */
export const defaultGetRegistry: GetRegistry = {
  pages: getCachedPages,
  image: getCachedImage,
  header: getCachedHeader,
  footer: getCachedFooter,
  page: getCachedPageByHref,
  icon: getCachedIconByName,
  sitemap: getCachedSitemap,
  iconSet: getCachedIconSet,
  tracking: getCachedTracking,
  'site-css': getCachedSiteCSS,
  designSet: getCachedDesignSet,
  'all-forms': getCachedAllForms,
  shortcutSet: getCachedShortcutSet,
  'atomic-forms': getCachedAtomicForms,
  'icon-options': getCachedIconOptions,
  'site-metadata': getCachedSiteMetadata,
  'backend-forms': getCachedBackendForms,
  'atomic-classes': getCachedAtomicClasses,
  'atomic-actions': getCachedAtomicActions,
  'form-submissions': getCachedFormSubmissions,
}

/** Build the standard `getCached` server-side function bound to a host project's
 *  Payload `configPromise`. Equivalent to `createGetCached(configPromise, defaultGetRegistry)`. */
export function createDefaultGetCached(configPromise: PayloadConfigPromise) {
  return createGetCached(configPromise, defaultGetRegistry)
}

export { createGetCached } from './getCached'
export type { GetRegistry, GetCachedFn } from './getCached'

export {
  getCachedPages,
  getCachedImage,
  getCachedFooter,
  getCachedHeader,
  getCachedSiteCSS,
  getCachedSitemap,
  getCachedPageByHref,
  getCachedTracking,
  getCachedDesignSet,
  getCachedShortcutSet,
  getCachedSiteMetadata,
  getCachedAtomicClasses,
  getCachedAtomicActions,
  getCachedFormSubmissions,
  getCachedIconByName,
  getCachedIconSet,
  getCachedIconOptions,
  getCachedAllForms,
  getCachedAtomicForms,
  getCachedBackendForms,
}
