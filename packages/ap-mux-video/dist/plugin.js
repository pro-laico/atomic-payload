import { muxVideoPlugin as upstreamMuxVideoPlugin } from '@oversightstudio/mux-video';
export const muxVideoPlugin = (opts = {}) => {
    const { enabled = true, adminThumbnail = 'image', uploadSettings = { cors_origin: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000' }, initSettings = {
        tokenId: process.env.MUX_TOKEN_ID || '',
        tokenSecret: process.env.MUX_TOKEN_SECRET || '',
        webhookSecret: process.env.MUX_WEBHOOK_SIGNING_SECRET || '',
    }, } = opts;
    return upstreamMuxVideoPlugin({
        enabled,
        adminThumbnail,
        extendCollection: 'mux-video',
        uploadSettings,
        initSettings,
    });
};
export default muxVideoPlugin;
//# sourceMappingURL=plugin.js.map