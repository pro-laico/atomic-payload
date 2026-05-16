import type { Metadata } from 'next';
import type { PageReturn } from '../types/cache';
import type { SiteMetaDatum } from '@pro-laico/site/schema';
type GenerateMetaDataArgs = {
    page?: PageReturn;
    siteMetadata?: SiteMetaDatum;
};
type GenerateMetaDataFn = (args: GenerateMetaDataArgs) => Metadata;
/** Gets the page metadata for a given page and site metadata. Returns a finished Metadata object. */
export declare const GenerateMetaData: GenerateMetaDataFn;
export {};
//# sourceMappingURL=generateMetaData.d.ts.map