import type { Plugin } from 'payload';
export interface AtomicMuxVideoOptions {
    enabled?: boolean;
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