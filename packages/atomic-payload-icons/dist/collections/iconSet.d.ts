import type { CollectionConfig, CollectionBeforeChangeHook, Field, PayloadRequest } from 'payload';
export interface IconSetCollectionOptions {
    /**
     * Optional atomicHook to attach to `beforeChange`. When omitted, no atomicHook is wired -
     * consumers using `atomic-payload-atomic-hook`'s plugin factory can attach it that way.
     */
    atomicHook?: CollectionBeforeChangeHook;
    /** Optional live preview URL generator (data, { req }) => string. */
    livePreviewUrl?: (args: {
        data: Record<string, unknown>;
        req: PayloadRequest;
    }) => string | Promise<string>;
    /** Extra fields appended to the Settings tab row (e.g. a TestPathField). */
    extraSettingsFields?: Field[];
    /** Override the `useAsTitle` admin setting. Defaults to `title`. */
    useAsTitle?: string;
    /** Override the admin `group` label. Defaults to `Sets`. */
    group?: string;
}
/**
 * Builds the IconSet collection config with the provided hooks/options.
 * Use `createIconSetCollection({...})` rather than importing `IconSet` directly
 * when you need to wire the atomicHook or live preview.
 */
export declare const createIconSetCollection: (opts?: IconSetCollectionOptions) => CollectionConfig;
/** Default IconSet collection with no atomicHook and no live preview wired. */
export declare const IconSet: CollectionConfig;
//# sourceMappingURL=iconSet.d.ts.map