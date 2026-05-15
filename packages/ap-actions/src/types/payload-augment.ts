/**
 * Schema stubs owned by `@pro-laico/ap-actions`. Each entry resolves to the
 * consumer project's concrete type when `PayloadAugment` is augmented; falls
 * back to a permissive default otherwise. See `@pro-laico/ap-types` README.
 */
import type { Get, DefaultRecord, DefaultBlock, DefaultActionFn } from '@pro-laico/ap-types'

// /////////////////////////////////////
// Block / function shapes
// /////////////////////////////////////

export type ActionBlocks = Get<'ActionBlocks', DefaultBlock[]>
export type AllActions = Get<'AllActions', DefaultRecord>
export type StoredAtomicActions = Get<'StoredAtomicActions', DefaultRecord>
export type Runners = Get<'Runners', DefaultActionFn[]>
export type Attributers = Get<'Attributers', DefaultActionFn[]>
export type Attributer = Get<'Attributer', DefaultActionFn>
export type StaticDataAttributes = Get<'StaticDataAttributes', Array<{ key?: string | null; value?: string | null }> | null | undefined>

// /////////////////////////////////////
// String-literal union types
// /////////////////////////////////////

export type ActionBlockType = Get<'ActionBlockType', string>
export type RunnerType = Get<'RunnerType', string>
export type AttributerType = Get<'AttributerType', string>
export type AtomicInputTypes = Get<'AtomicInputTypes', string>
export type AtomicButtonTypes = Get<'AtomicButtonTypes', string>
export type AtomicChildVariants = Get<'AtomicChildVariants', string>
export type AtomicButtonPortalTypes = Get<'AtomicButtonPortalTypes', string>
