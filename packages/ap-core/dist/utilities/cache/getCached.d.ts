import 'server-only';
import type { AllTagsWithGetters, GCArgs, GCReturns, GCFunction, PayloadConfigPromise } from '../../types/cache';
export type GetRegistry = {
    [K in AllTagsWithGetters]: GCFunction<K>;
};
export interface GetCachedFn {
    (...args: GCArgs<'icon'>): GCReturns<'icon'>;
    (...args: GCArgs<'page'>): GCReturns<'page'>;
    (...args: GCArgs<'image'>): GCReturns<'image'>;
    (...args: GCArgs<'pages'>): GCReturns<'pages'>;
    (...args: GCArgs<'header'>): GCReturns<'header'>;
    (...args: GCArgs<'footer'>): GCReturns<'footer'>;
    (...args: GCArgs<'sitemap'>): GCReturns<'sitemap'>;
    (...args: GCArgs<'iconSet'>): GCReturns<'iconSet'>;
    (...args: GCArgs<'site-css'>): GCReturns<'site-css'>;
    (...args: GCArgs<'tracking'>): GCReturns<'tracking'>;
    (...args: GCArgs<'all-forms'>): GCReturns<'all-forms'>;
    (...args: GCArgs<'designSet'>): GCReturns<'designSet'>;
    (...args: GCArgs<'shortcutSet'>): GCReturns<'shortcutSet'>;
    (...args: GCArgs<'atomic-forms'>): GCReturns<'atomic-forms'>;
    (...args: GCArgs<'icon-options'>): GCReturns<'icon-options'>;
    (...args: GCArgs<'backend-forms'>): GCReturns<'backend-forms'>;
    (...args: GCArgs<'site-metadata'>): GCReturns<'site-metadata'>;
    (...args: GCArgs<'atomic-classes'>): GCReturns<'atomic-classes'>;
    (...args: GCArgs<'atomic-actions'>): GCReturns<'atomic-actions'>;
    (...args: GCArgs<'form-submissions'>): GCReturns<'form-submissions'>;
}
export declare function createGetCached(configPromise: PayloadConfigPromise, getRegistry: GetRegistry): GetCachedFn;
//# sourceMappingURL=getCached.d.ts.map