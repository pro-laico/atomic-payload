import type { Config, ChildBlockType, ActionBlockType } from '@/ts/types'
import type { BlockSlug, CollectionSlug } from 'payload'
export * from './apf'
export * from './css'
export * from './cache'
export * from './forms'
export * from './actions'
export * from './frontEnd'
export * from './payload-types'

// /////////////////////////////////////
// Miscellaneous Types
// /////////////////////////////////////

export type StringKeyOf<T> = Extract<keyof T, string>

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

export type DotNestedKeys<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends object ? `${K}` | `${K}.${DotNestedKeys<T[K]>}` : `${K}`
    }[keyof T & (string | number)]
  : never

export type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never

// /////////////////////////////////////
// Payload Types
// /////////////////////////////////////
export type AllBlocks = Config['blocks'][keyof Config['blocks']]
export type AllCollections = Config['collections'][keyof Config['collections']]

export type CollectionBySlug<T extends CollectionSlug> = Config['collections'][T]

export type BlockBySlug<T extends BlockSlug> = Config['blocks'][T]
export type ChildBySlug<T extends ChildBlockType> = BlockBySlug<T>
export type ActionBySlug<T extends ActionBlockType> = BlockBySlug<T>

export type AllBlockDotNestedKeys = DotNestedKeys<AllBlocks>
