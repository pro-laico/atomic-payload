import type { CollectionConfig, Config, Plugin } from 'payload'
import { muxVideoPlugin as upstreamMuxVideoPlugin } from '@oversightstudio/mux-video'

import { mergeHooks } from '@pro-laico/core'

import { MuxVideo } from './collections/muxVideo'

export interface AtomicMuxVideoOptions {
  enabled?: boolean
  /** When true (default), registers the `mux-video` extension collection that the
   * upstream plugin's `extendCollection: 'mux-video'` attaches its fields to.
   * Set to false if you register your own extension collection with the same slug. */
  includeCollection?: boolean
  /**
   * Override for the bundled `MuxVideo` extension collection. Top-level keys
   * replace, but `access`/`admin` are deep-merged, `fields` are appended, and
   * `hooks` are merged per phase — so a partial override can't silently drop the
   * collection's access rules or other fields.
   */
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

    if (!initSettings.tokenId || !initSettings.tokenSecret) {
      console.warn(
        '[mux-video] MUX_TOKEN_ID / MUX_TOKEN_SECRET are empty — Mux uploads and API calls will fail. Set them in the environment before buildConfig runs, or pass `initSettings` explicitly.',
      )
    }

    const collection: CollectionConfig = collectionOverride
      ? {
          ...MuxVideo,
          ...collectionOverride,
          // Deep-merge nested keys a top-level spread would otherwise replace.
          access: { ...MuxVideo.access, ...collectionOverride.access },
          admin: { ...MuxVideo.admin, ...collectionOverride.admin },
          fields: [...MuxVideo.fields, ...(collectionOverride.fields ?? [])],
          hooks: collectionOverride.hooks ? mergeHooks(MuxVideo.hooks ?? {}, collectionOverride.hooks) : MuxVideo.hooks,
        }
      : MuxVideo
    const next: Config = includeCollection ? { ...config, collections: [...(config.collections ?? []), collection] } : config

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
