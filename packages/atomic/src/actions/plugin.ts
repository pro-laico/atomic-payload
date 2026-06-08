import type { Block, Config, Plugin } from 'payload'

import { AllActionBlocks } from './blocks/blocks'

export interface ActionsPluginOptions {
  enabled?: boolean
  /**
   * Additional Payload blocks merged after the package’s default action blocks
   * and before any blocks already on `config.blocks`.
   */
  actionBlocks?: Block[]
  /**
   * @deprecated Use {@link ActionsPluginOptions.actionBlocks} instead.
   */
  blocks?: Block[]
}

/**
 * Prepends default action blocks (cookie consent, forms, dynamic store, …) to
 * `config.blocks`. Run this plugin **before** `childBlocksPlugin` so child
 * blocks remain first in the merged list.
 */
export const actionsPlugin =
  (opts: ActionsPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, actionBlocks: more, blocks: legacy } = opts
    if (!enabled) return config
    const additional = [...(more ?? []), ...(legacy ?? [])]
    return {
      ...config,
      blocks: [...AllActionBlocks, ...additional, ...(config.blocks ?? [])],
    }
  }

export default actionsPlugin
