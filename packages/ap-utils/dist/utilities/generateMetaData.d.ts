import type { Metadata } from 'next';
import type { PageReturn } from '@pro-laico/atomic-payload-types';
import type { SiteMetaDatum } from '@pro-laico/atomic-payload-types/schema';
type GenerateMetaDataArgs = {
    page?: PageReturn;
    siteMetadata?: SiteMetaDatum;
};
type GenerateMetaDataFn = (args: GenerateMetaDataArgs) => Metadata;
/** Gets the page metadata for a given page and site metadata. Returns a finished Metadata object. */
export declare const GenerateMetaData: GenerateMetaDataFn;
export {};
//# sourceMappingURL=generateMetaData.d.ts.map