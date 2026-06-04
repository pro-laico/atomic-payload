import type { Config, Plugin } from 'payload'

import { PostHogProperty } from './collections/posthogProperty'
import { Tracking } from './globals/tracking'

export interface TrackingPluginOptions {
  /** When false, the plugin is a no-op. Defaults to true. */
  enabled?: boolean
  /** When true (default), registers the `posthogProperty` collection. */
  includePropertyCollection?: boolean
  /** When true (default), registers the `Tracking` global. */
  includeTrackingGlobal?: boolean
}

export const trackingPlugin =
  (opts: TrackingPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, includePropertyCollection = true, includeTrackingGlobal = true } = opts
    if (!enabled) return config

    return {
      ...config,
      collections: [...(config.collections ?? []), ...(includePropertyCollection ? [PostHogProperty] : [])],
      globals: [...(config.globals ?? []), ...(includeTrackingGlobal ? [Tracking] : [])],
    }
  }

export default trackingPlugin
