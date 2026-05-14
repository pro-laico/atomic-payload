import type { Plugin } from 'payload'
import { muxVideoPlugin as upstreamMuxVideoPlugin } from '@oversightstudio/mux-video'

export interface AtomicMuxVideoOptions {
  enabled?: boolean
  adminThumbnail?: 'image' | 'gif' | 'none'
  uploadSettings?: { cors_origin: string }
  initSettings?: { tokenId: string; tokenSecret: string; webhookSecret: string }
}

export const muxVideoPlugin = (opts: AtomicMuxVideoOptions = {}): Plugin => {
  const {
    enabled = true,
    adminThumbnail = 'image',
    uploadSettings = { cors_origin: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000' },
    initSettings = {
      tokenId: process.env.MUX_TOKEN_ID || '',
      tokenSecret: process.env.MUX_TOKEN_SECRET || '',
      webhookSecret: process.env.MUX_WEBHOOK_SIGNING_SECRET || '',
    },
  } = opts

  return upstreamMuxVideoPlugin({
    enabled,
    adminThumbnail,
    extendCollection: 'mux-video',
    uploadSettings,
    initSettings,
  })
}

export default muxVideoPlugin
