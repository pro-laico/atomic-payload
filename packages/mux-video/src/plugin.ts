import type { Config, Plugin, CollectionConfig } from 'payload'
import { muxVideoPlugin as upstreamMuxVideoPlugin } from '@oversightstudio/mux-video'
import { MuxVideo } from './collections/muxVideo'

export interface AtomicMuxVideoOptions {
  enabled?: boolean
  /** When true (default), registers the `mux-video` extension collection that the
   * upstream plugin's `extendCollection: 'mux-video'` attaches its fields to.
   * Set to false if you register your own extension collection with the same slug. */
  includeCollection?: boolean
  /** Shallow override for the bundled `MuxVideo` extension collection. */
  collectionOverride?: Partial<CollectionConfig>
  adminThumbnail?: 'image' | 'gif' | 'none'
  uploadSettings?: { cors_origin: string }
  initSettings?: { tokenId: string; tokenSecret: string; webhookSecret: string }
}

export const muxVideoPlugin =
  (opts: AtomicMuxVideoOptions = {}): Plugin =>
  (config: Config): Config => {
    const {
      enabled = true,
      includeCollection = true,
      collectionOverride,
      adminThumbnail = 'image',
      uploadSettings = { cors_origin: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000' },
      initSettings = {
        tokenId: process.env.MUX_TOKEN_ID || '',
        tokenSecret: process.env.MUX_TOKEN_SECRET || '',
        webhookSecret: process.env.MUX_WEBHOOK_SIGNING_SECRET || '',
      },
    } = opts
    if (!enabled) return config

    const collection: CollectionConfig = collectionOverride ? { ...MuxVideo, ...collectionOverride } : MuxVideo
    const next: Config = includeCollection
      ? { ...config, collections: [...(config.collections ?? []), collection] }
      : config

    const upstream = upstreamMuxVideoPlugin({
      enabled,
      adminThumbnail,
      extendCollection: 'mux-video',
      uploadSettings,
      initSettings,
    })
    const result = upstream(next)
    if (result instanceof Promise) {
      throw new Error('[mux-video] upstream muxVideoPlugin returned a Promise — Payload plugin composition requires sync return.')
    }
    return result
  }

export default muxVideoPlugin
