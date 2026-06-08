/**
 * Kernel of the per-package PayloadAugment system.
 *
 * Domain packages (ap-actions, ap-icons, ap-site, …) define their own schema
 * stubs as `export type X = Get<'X', Default>` against the single `PayloadAugment`
 * interface declared here. Consumer projects fill the interface in once via
 * module augmentation, and every package's stubs resolve to the project's
 * concrete shapes.
 */

import type { BlockSlug, CollectionSlug } from 'payload'

/**
 * Index interface that consumer projects extend via `declare module
 * '@pro-laico/core'` to supply concrete shapes from their generated
 * `payload-types.ts`.
 */
export interface PayloadAugment {}

/** Look up `K` in the augmented `PayloadAugment` interface; fall back to `F` when absent. */
export type Get<K extends string, F> = PayloadAugment extends Record<K, infer T> ? T : F

/**
 * Like `Extract<U, V>`, but when `Extract` collapses to `never` (e.g. because `U`
 * is an un-augmented default like `DefaultBlock` whose discriminant is `string`),
 * fall back to `U & V` so the discriminant literal is preserved.
 */
export type ExtractOrDefault<U, V> = [Extract<U, V>] extends [never] ? U & V : Extract<U, V>

// /////////////////////////////////////
// Default fallbacks. Picked so each domain package compiles cleanly without
// augmentation — `Config['collections']` indexes by `string`, blocks have a
// `blockType` discriminator, runners/attributers have a `type` discriminator.
// /////////////////////////////////////

export type DefaultRecord = Record<string, any>
export type DefaultConfig = {
  collections: Record<string, any>
  globals: Record<string, any>
  blocks: Record<string, any>
  [key: string]: any
}
export type DefaultBlock = { blockType: string; [k: string]: any }
export type DefaultActionFn = { type: string; [k: string]: any }

// /////////////////////////////////////
// Root config stub — used everywhere, kept here to avoid a cycle through any
// single domain package.
// /////////////////////////////////////

export type Config = Get<'Config', DefaultConfig>

// /////////////////////////////////////
// Generic helpers (not Payload-specific).
// /////////////////////////////////////

export type StringKeyOf<T> = Extract<keyof T, string>

export type DotNestedKeys<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends object ? `${K}` | `${K}.${DotNestedKeys<T[K]>}` : `${K}`
    }[keyof T & (string | number)]
  : never

export type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never

/** Merges two tuple types by appending the second tuple to the first. */
export type MergeTuples<T extends readonly unknown[], U extends readonly unknown[]> = [...T, ...U]

// /////////////////////////////////////
// Generic Payload-config helpers (rely only on the kernel `Config` stub).
// /////////////////////////////////////

export type AllCollections = Config['collections'][keyof Config['collections']]
export type AllBlocks = Config['blocks'][keyof Config['blocks']]
export type CollectionBySlug<T extends CollectionSlug> = Config['collections'][T]
export type BlockBySlug<T extends BlockSlug> = Config['blocks'][T]
