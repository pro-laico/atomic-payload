import type { Config, Plugin } from 'payload'

import { Tracking } from './globals/tracking'
import { PostHogProperty } from './collections/posthogProperty'

export interface TrackingPluginOptions {
  enabled?: boolean
  /** Whether to add the posthogProperty collection. Defaults to true. */
  addPropertyCollection?: boolean
  /** Whether to add the Tracking global. Defaults to true. */
  addTrackingGlobal?: boolean
}

export const trackingPlugin =
  (opts: TrackingPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, addPropertyCollection = true, addTrackingGlobal = true } = opts
    if (!enabled) return config

    return {
      ...config,
      collections: [...(config.collections ?? []), ...(addPropertyCollection ? [PostHogProperty] : [])],
      globals: [...(config.globals ?? []), ...(addTrackingGlobal ? [Tracking] : [])],
    }
  }

export default trackingPlugin
