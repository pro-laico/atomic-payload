/**
 * Schema stubs owned by `@pro-laico/atomic/children`.
 */
import type { Get, DefaultBlock } from '@pro-laico/ap-core'

// /////////////////////////////////////
// Block shapes
// /////////////////////////////////////

export type ChildBlocks = Get<'ChildBlocks', DefaultBlock[]>
export type AtomicChild = Get<'AtomicChild', DefaultBlock>
export type ImageChild = Get<'ImageChild', DefaultBlock>
export type VideoChild = Get<'VideoChild', DefaultBlock>
export type IconChild = Get<'IconChild', DefaultBlock>
export type SVGChild = Get<'SVGChild', DefaultBlock>
export type RichTextChild = Get<'RichTextChild', DefaultBlock>
export type SimpleTextChild = Get<'SimpleTextChild', DefaultBlock>

// /////////////////////////////////////
// String-literal union types
// /////////////////////////////////////

export type ChildBlockType = Get<'ChildBlockType', string>
export type NonRecursiveChildBlockType = Get<'NonRecursiveChildBlockType', string>
export type ChildrenWithActions = Get<'ChildrenWithActions', string>
