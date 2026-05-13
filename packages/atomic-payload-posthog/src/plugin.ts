import type { Config, Plugin } from 'payload'
import { PostHogProperty } from './collections/posthogProperty'

export interface PostHogPluginOptions {
  enabled?: boolean
  /** Whether to add the posthogProperty collection. Defaults to true. */
  addPropertyCollection?: boolean
}

export const posthogPlugin =
  (opts: PostHogPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, addPropertyCollection = true } = opts
    if (!enabled) return config

    return {
      ...config,
      collections: [...(config.collections ?? []), ...(addPropertyCollection ? [PostHogProperty] : [])],
    }
  }

export default posthogPlugin
