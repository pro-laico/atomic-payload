import type { Block } from 'payload'
import { createRichTextBlock } from '@pro-laico/richtext'
import { createSvgBlock } from '@pro-laico/icons/blocks/svgChild'
import { createIconBlock } from '@pro-laico/icons/blocks/iconChild'
import { createImageBlock } from '@pro-laico/images/blocks/imageChild'
import { createVideoBlock } from '@pro-laico/mux-video/blocks/videoChild'
import type { BlockFieldExtensions, ClassNameFieldWrapper } from '@pro-laico/core'

import { createSimpleTextBlock } from './simpleText/block'
import { AtomicBlockFactory, defaultAtomicDepthControls } from './atomic/block'

/**
 * Slugs of the default child blocks that accept generic `prependFields` /
 * `appendFields` (everything except the `AtomicChild` special case).
 */
export type GenericChildBlockSlug = 'SimpleTextChild' | 'RichTextChild' | 'ImageChild' | 'VideoChild' | 'IconChild' | 'SVGChild'

/** Options for {@link buildChildBlocks}. */
export interface BuildChildBlocksOptions {
  /**
   * Per-block field extensions, keyed by block slug. Each block spreads its
   * entry's `prependFields` / `appendFields` at the start / end of its primary
   * content tab. The consumer decides what to put there (e.g. the
   * `@pro-laico/styles` `ClassNameField`, project-specific fields, or nothing),
   * so the block packages stay free of any CSS dependency.
   */
  blockFields?: Partial<Record<GenericChildBlockSlug, BlockFieldExtensions>>
  /**
   * `AtomicChild` special case (unchanged for now): the `ClassNameField`
   * wrapper threaded into the AtomicChild content / trigger / backdrop spots.
   * The generic `blockFields` mechanism does not cover `AtomicChild`.
   */
  classNameField?: ClassNameFieldWrapper
}

/**
 * Builds the default set of child blocks (Atomic, SimpleText, RichText, Image,
 * Video, Icon, SVG) from each package's block factory.
 *
 * The six non-Atomic blocks take generic prepend/append fields via
 * {@link BuildChildBlocksOptions.blockFields}; `AtomicChild` keeps its own
 * `classNameField` passthrough. Used by {@link childBlocksPlugin}; call directly
 * only for advanced composition.
 */
export function buildChildBlocks({ blockFields, classNameField }: BuildChildBlocksOptions = {}): Block[] {
  return [
    AtomicBlockFactory({ depthControls: defaultAtomicDepthControls, classNameField }),
    createSimpleTextBlock(blockFields?.SimpleTextChild),
    createRichTextBlock(blockFields?.RichTextChild),
    createImageBlock(blockFields?.ImageChild),
    createVideoBlock(blockFields?.VideoChild),
    createIconBlock(blockFields?.IconChild),
    createSvgBlock(blockFields?.SVGChild),
  ]
}
