import type { CollectionConfig, Config, Plugin } from 'payload'
import { Font } from './collections/font'

export interface FontsPluginOptions {
  enabled?: boolean
  fontOverride?: Partial<CollectionConfig>
}

export const fontsPlugin =
  (opts: FontsPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, fontOverride } = opts
    if (!enabled) return config
    const merged: CollectionConfig = fontOverride ? { ...Font, ...fontOverride } : Font
    return { ...config, collections: [...(config.collections ?? []), merged] }
  }

export default fontsPlugin
