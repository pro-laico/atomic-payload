import type { BlockFieldExtensions, ClassNameFieldWrapper } from '@pro-laico/core'
import type { Block, Config, Plugin } from 'payload'

import { buildChildBlocks, type GenericChildBlockSlug } from './buildChildBlocks'

export interface ChildBlocksPluginOptions {
  enabled?: boolean
  /**
   * Extra Payload blocks to register as child blocks, merged after the package
   * defaults and before any blocks already on `config.blocks`.
   */
  childBlocks?: Block[]
  /**
   * Generic per-block field extensions, keyed by block slug. Each default block
   * spreads its entry's `prependFields` / `appendFields` at the start / end of
   * its primary content tab. The consumer decides what goes there — the
   * `@pro-laico/styles` `ClassNameField`, project-specific fields, or nothing —
   * so `@pro-laico/icons`, `images`, `mux-video`, and `richtext` stay free of
   * any `@pro-laico/styles` dependency.
   *
   * Does not cover `AtomicChild` (see {@link ChildBlocksPluginOptions.classNameField}).
   *
   * @example
   * ```ts
   * import { ClassNameField } from '@pro-laico/styles'
   * childBlocksPlugin({
   *   blockFields: {
   *     SVGChild: { prependFields: [ClassNameField({ label: 'SVG Atomic Classes' })] },
   *     ImageChild: { prependFields: [ClassNameField({ label: 'Image Atomic Classes' })] },
   *   },
   * })
   * ```
   */
  blockFields?: Partial<Record<GenericChildBlockSlug, BlockFieldExtensions>>
  /**
   * `AtomicChild` special case (unchanged for now): the `@pro-laico/styles`
   * `ClassNameField` wrapper, threaded into the AtomicChild content / trigger /
   * backdrop spots. The generic {@link ChildBlocksPluginOptions.blockFields}
   * mechanism does not cover `AtomicChild`.
   */
  classNameField?: ClassNameFieldWrapper
  /**
   * @deprecated Use {@link ChildBlocksPluginOptions.childBlocks} instead.
   */
  extra?: Block[]
}

/**
 * Registers default Payload child blocks (Atomic, SimpleText, RichText, Image, …)
 * via Payload's plugin pipeline.
 *
 * Use `blockFields` to prepend/append fields to the six non-Atomic blocks, and
 * `classNameField` for the AtomicChild special case. Omit both and the blocks
 * register with no extra fields and no CSS dependency.
 */
export const childBlocksPlugin =
  (opts: ChildBlocksPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, childBlocks: moreChildBlocks, blockFields, classNameField, extra } = opts
    if (!enabled) return config
    const additional = [...(moreChildBlocks ?? []), ...(extra ?? [])]
    const base = [...buildChildBlocks({ blockFields, classNameField }), ...additional, ...(config.blocks ?? [])]
    return { ...config, blocks: base }
  }

export default childBlocksPlugin
