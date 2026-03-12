import { muxVideoPlugin } from '@oversightstudio/mux-video'

export const muxVideoPluginConfig = muxVideoPlugin({
  enabled: true,
  adminThumbnail: 'image',
  extendCollection: 'mux-video', //Most changes should be made to the MuxVideo collection. @/collections/muxVideos.ts
  uploadSettings: { cors_origin: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000' },
  initSettings: {
    tokenId: process.env.MUX_TOKEN_ID || '',
    tokenSecret: process.env.MUX_TOKEN_SECRET || '',
    webhookSecret: process.env.MUX_WEBHOOK_SIGNING_SECRET || '',
  },
})
