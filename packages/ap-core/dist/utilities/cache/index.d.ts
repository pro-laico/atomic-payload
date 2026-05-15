import 'server-only';
import type { PayloadConfigPromise } from '../../types/cache';
import { type GetRegistry } from './getCached';
import { getCachedPages } from './getPages';
import { getCachedImage } from './getImage';
import { getCachedFooter } from './getFooter';
import { getCachedHeader } from './getHeader';
import { getCachedSiteCSS } from './getSiteCSS';
import { getCachedSitemap } from './getSitemap';
import { getCachedPageByHref } from './getPage';
import { getCachedTracking } from './getTracking';
import { getCachedDesignSet } from './getDesignSet';
import { getCachedShortcutSet } from './getShortcutSet';
import { getCachedSiteMetadata } from './getSiteMetadata';
import { getCachedAtomicClasses } from './getAtomicClasses';
import { getCachedAtomicActions } from './getAtomicActions';
import { getCachedFormSubmissions } from './getFormSubmissions';
import { getCachedIconByName, getCachedIconSet, getCachedIconOptions } from './getIcon';
import { getCachedAllForms, getCachedAtomicForms, getCachedBackendForms } from './getForms';
/** The registry of stock getter functions shipped by `@pro-laico/ap-core`.
 *  Consumers can pass this directly to `createGetCached` to get the standard
 *  Atomic Payload caching behavior, or compose a partial set with their own
 *  getters for project-specific tags. */
export declare const defaultGetRegistry: GetRegistry;
/** Build the standard `getCached` server-side function bound to a host project's
 *  Payload `configPromise`. Equivalent to `createGetCached(configPromise, defaultGetRegistry)`. */
export declare function createDefaultGetCached(configPromise: PayloadConfigPromise): import("./getCached").GetCachedFn;
export { createGetCached } from './getCached';
export type { GetRegistry, GetCachedFn } from './getCached';
export { getCachedPages, getCachedImage, getCachedFooter, getCachedHeader, getCachedSiteCSS, getCachedSitemap, getCachedPageByHref, getCachedTracking, getCachedDesignSet, getCachedShortcutSet, getCachedSiteMetadata, getCachedAtomicClasses, getCachedAtomicActions, getCachedFormSubmissions, getCachedIconByName, getCachedIconSet, getCachedIconOptions, getCachedAllForms, getCachedAtomicForms, getCachedBackendForms, };
//# sourceMappingURL=index.d.ts.map