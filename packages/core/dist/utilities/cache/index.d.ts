import 'server-only';
import type { PayloadConfigPromise } from '../../types/cache';
import { getCachedAtomicActions } from './getAtomicActions';
import { createGetCachedAtomicClasses, getCachedAtomicClasses } from './getAtomicClasses';
import { type GetRegistry } from './getCached';
import { getCachedDesignSet } from './getDesignSet';
import { getCachedFooter } from './getFooter';
import { getCachedFormSubmissions } from './getFormSubmissions';
import { createGetCachedAtomicForms, createGetCachedBackendForms, getCachedAllForms, getCachedAtomicForms, getCachedBackendForms } from './getForms';
import { getCachedHeader } from './getHeader';
import { getCachedIconByName, getCachedIconOptions, getCachedIconSet } from './getIcon';
import { getCachedImage } from './getImage';
import { createGetCachedPageByHref, getCachedPageByHref } from './getPage';
import { createGetCachedPages, getCachedPages } from './getPages';
import { getCachedShortcutSet } from './getShortcutSet';
import { getCachedSiteCSS } from './getSiteCSS';
import { getCachedSiteMetadata } from './getSiteMetadata';
import { createGetCachedSitemap, getCachedSitemap } from './getSitemap';
import { getCachedTracking } from './getTracking';
/** Collection-slug configuration for the default getter registry. */
export type DefaultGetRegistryOptions = {
    /** Slug of the pages collection. Defaults to `'pages'`. */
    pagesSlug?: string;
    /** Slug of the forms collection. Defaults to `'forms'`. */
    formsSlug?: string;
};
/** Build a `GetRegistry` whose page-bound getters target the supplied slugs.
 *  Defaults match the atomic-payload template (`pages`, `forms`). */
export declare function createDefaultGetRegistry(options?: DefaultGetRegistryOptions): GetRegistry;
/** The registry of stock getter functions shipped by `@pro-laico/core`, bound
 *  to the default `pages` / `forms` slugs. Pass directly to `createGetCached`
 *  for the standard behavior, or call `createDefaultGetRegistry({ pagesSlug, formsSlug })`
 *  to bind different slugs. */
export declare const defaultGetRegistry: GetRegistry;
/** Build the standard `getCached` server-side function bound to a host project's
 *  Payload `configPromise`. Equivalent to `createGetCached(configPromise, defaultGetRegistry)`. */
export declare function createDefaultGetCached(configPromise: PayloadConfigPromise, options?: DefaultGetRegistryOptions): import("./getCached").GetCachedFn;
export type { GetCachedFn, GetRegistry } from './getCached';
export { createGetCached } from './getCached';
export { createGetCachedAtomicClasses, createGetCachedAtomicForms, createGetCachedBackendForms, createGetCachedPageByHref, createGetCachedPages, createGetCachedSitemap, getCachedAllForms, getCachedAtomicActions, getCachedAtomicClasses, getCachedAtomicForms, getCachedBackendForms, getCachedDesignSet, getCachedFooter, getCachedFormSubmissions, getCachedHeader, getCachedIconByName, getCachedIconOptions, getCachedIconSet, getCachedImage, getCachedPageByHref, getCachedPages, getCachedShortcutSet, getCachedSiteCSS, getCachedSiteMetadata, getCachedSitemap, getCachedTracking, };
//# sourceMappingURL=index.d.ts.map