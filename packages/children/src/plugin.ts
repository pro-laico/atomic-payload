import type { Block, Config, Plugin } from 'payload'
import childBlocks from './blocks'

export interface ChildBlocksPluginOptions {
  enabled?: boolean
  /**
   * Extra Payload blocks to register as child blocks, merged after the package
   * defaults and before any blocks already on `config.blocks`.
   */
  childBlocks?: Block[]
  /**
   * @deprecated Use {@link ChildBlocksPluginOptions.childBlocks} instead.
   */
  extra?: Block[]
}

/**
 * Registers default Payload child blocks (Atomic, SimpleText, RichText, Image, …)
 * via Payload's plugin pipeline.
 */
export const childBlocksPlugin =
  (opts: ChildBlocksPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, childBlocks: moreChildBlocks, extra } = opts
    if (!enabled) return config
    const additional = [...(moreChildBlocks ?? []), ...(extra ?? [])]
    const base = [...childBlocks, ...additional, ...(config.blocks ?? [])]
    return { ...config, blocks: base }
  }

export default childBlocksPlugin
