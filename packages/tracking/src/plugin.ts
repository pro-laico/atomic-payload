import type { Config, Plugin } from 'payload'

import { Tracking } from './globals/tracking'

export interface TrackingPluginOptions {
  /** When false, the plugin is a no-op. Defaults to true. */
  enabled?: boolean
  /** When true (default), registers the `Tracking` global. */
  includeTrackingGlobal?: boolean
}

export const trackingPlugin =
  (opts: TrackingPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, includeTrackingGlobal = true } = opts
    if (!enabled) return config

    return {
      ...config,
      globals: [...(config.globals ?? []), ...(includeTrackingGlobal ? [Tracking] : [])],
    }
  }

export default trackingPlugin
