import { muxVideoPlugin as upstreamMuxVideoPlugin } from '@oversightstudio/mux-video';
import { mergeHooks } from '@pro-laico/core';
import { MuxVideo } from './collections/muxVideo';
export const muxVideoPlugin = (opts = {}) => (config) => {
    const { enabled = true, includeCollection = true, collectionOverride, adminThumbnail = 'image', uploadSettings = { cors_origin: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000' }, initSettings = {
        tokenId: process.env.MUX_TOKEN_ID || '',
        tokenSecret: process.env.MUX_TOKEN_SECRET || '',
        webhookSecret: process.env.MUX_WEBHOOK_SIGNING_SECRET || '',
    }, } = opts;
    if (!enabled)
        return config;
    const collection = collectionOverride
        ? {
            ...MuxVideo,
            ...collectionOverride,
            // Deep-merge nested keys a top-level spread would otherwise replace.
            access: { ...MuxVideo.access, ...collectionOverride.access },
            admin: { ...MuxVideo.admin, ...collectionOverride.admin },
            fields: [...MuxVideo.fields, ...(collectionOverride.fields ?? [])],
            hooks: collectionOverride.hooks ? mergeHooks(MuxVideo.hooks ?? {}, collectionOverride.hooks) : MuxVideo.hooks,
        }
        : MuxVideo;
    const next = includeCollection ? { ...config, collections: [...(config.collections ?? []), collection] } : config;
    const upstream = upstreamMuxVideoPlugin({
        enabled,
        adminThumbnail,
        extendCollection: 'mux-video',
        uploadSettings,
        initSettings,
    });
    const result = upstream(next);
    if (result instanceof Promise) {
        throw new Error('[mux-video] upstream muxVideoPlugin returned a Promise — Payload plugin composition requires sync return.');
    }
    return result;
};
export default muxVideoPlugin;
//# sourceMappingURL=plugin.js.map