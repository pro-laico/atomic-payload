import type { CollectionConfig, Plugin } from 'payload';
export interface AtomicMuxVideoOptions {
    enabled?: boolean;
    /** When true (default), registers the `mux-video` extension collection that the
     * upstream plugin's `extendCollection: 'mux-video'` attaches its fields to.
     * Set to false if you register your own extension collection with the same slug. */
    includeCollection?: boolean;
    /**
     * Override for the bundled `MuxVideo` extension collection. Top-level keys
     * replace, but `access`/`admin` are deep-merged, `fields` are appended, and
     * `hooks` are merged per phase — so a partial override can't silently drop the
     * collection's access rules or other fields.
     */
    collectionOverride?: Partial<CollectionConfig>;
    adminThumbnail?: 'image' | 'gif' | 'none';
    uploadSettings?: {
        cors_origin: string;
    };
    initSettings?: {
        tokenId: string;
        tokenSecret: string;
        webhookSecret: string;
    };
}
export declare const muxVideoPlugin: (opts?: AtomicMuxVideoOptions) => Plugin;
export default muxVideoPlugin;
//# sourceMappingURL=plugin.d.ts.map