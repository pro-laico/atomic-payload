// /////////////////////////////////////
// Hand-written types for the child-block render surface.
// /////////////////////////////////////
import type { ReactNode } from 'react'
import type { StringKeyOf, DotNestedKeys } from '@pro-laico/ap-types'
import type { ChildBlocks, ChildBlockType } from './payload-augment'

// Schema stubs are intentionally NOT re-exported — see `/schema` subpath.
// Block lookup helpers from ap-types are re-exported below.

/** The type used by the atomic child block's for depth management */
export type DepthControls = {
  /** Current content blocks depth. */
  cd: number
  /** The maximum content blocks depth. */
  cmd: number
  /** The current trigger blocks depth. */
  td: number
  /** The maximum trigger blocks depth. */
  tmd: number
}

// /////////////////////////////////////
// Block lookup helpers
// /////////////////////////////////////

import type { BlockBySlug, AllBlocks } from '@pro-laico/ap-types'
export type { BlockBySlug, AllBlocks } from '@pro-laico/ap-types'

export type ChildBySlug<T extends ChildBlockType> = BlockBySlug<T>
export type AllBlockDotNestedKeys = DotNestedKeys<AllBlocks>

// /////////////////////////////////////
// Render / pass-through types
// /////////////////////////////////////

export type Apply = Record<string, unknown>

export interface AtomicChildReturn {
  /** Props That Can Be Applied To Trigger */
  tp: Apply
  /**  Props That Can Be Applied To Backdrop */
  bp: Apply
}

export type PassThrough = {
  /** Props that should be spread on target element */
  p?: Record<string, unknown>
  /** Children */
  children?: ReactNode
  /** Data Attributes that should be spread on target element*/
  da?: Record<string, string>
}

export type PassThroughs = {
  /** Content Pass Throughs */
  c: PassThrough
  /** Trigger Pass Throughs */
  t: PassThrough
  /** Portal Pass Throughs */
  po: {
    /** Backdrop Pass Throughs */
    b: Omit<PassThrough, 'da'>
    /** Dialog Pass Throughs */
    di: Omit<PassThrough, 'children' | 'da'>
    /** Popover Pass Throughs */
    pop: Omit<PassThrough, 'children' | 'da'>
  }
}

/** Used for base ui custom components. */
export interface RenderChild<T extends ChildBlocks[number] | ChildBlocks> {
  /** The block being rendered */
  block: T
  /** All Possible Pass Throughs. Includes spreadable props, children components, and data attributes. */
  pt: PassThroughs
  contentChildren?: ReactNode
  triggerChildren?: ReactNode
  backdropChildren?: ReactNode
}

/** {@link RenderChildrenProps} */
export type RenderChildrenProps = React.FC<{
  blocks?: ChildBlocks | null
}>

// re-export for callers that historically imported StringKeyOf from this surface
export type { StringKeyOf }
