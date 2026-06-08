/**
 * Cache / revalidate-tag types — owned by `@pro-laico/core` because the
 * revalidation helpers (`revalidateTag`, the cache loggers) live here.
 *
 * The read-side `getCached` dispatcher and its per-tag return types moved out
 * with the getters: each package now owns its getter (and that getter's return
 * type) and wraps fetches with `withCache` from `@pro-laico/core/cache`.
 */

// biome-ignore-all lint/suspicious/noConfusingVoidType: `return: void` is intentional — these properties are later wrapped in `Promise<...>` and represent functions that return nothing.

import type { SanitizedConfig } from 'payload'

/** The Payload config (or its resolution promise) used to instantiate a Payload local-API client. */
export type PayloadConfigPromise = SanitizedConfig | Promise<SanitizedConfig>

/** Data returned by the revalidateTag function. */
export type RevalidateTagResponse = { success: boolean; message: string; timestamp: string }

// /////////////////////////////////////
// Tags
// /////////////////////////////////////

type PageTags = 'page'
type CacheTags = 'draft' | 'published'
type GlobalsTags = 'tracking' | 'settings'
type CSSTags = 'site-css' | 'atomic-classes'
type IconTags = 'iconSet' | 'icon' | 'icon-options'
type CollectionsTags = 'designSet' | 'footer' | 'header' | 'shortcutSet'
type FrontEndTags = 'sitemap' | 'pages' | 'site-metadata' | 'atomic-actions'
type FormsTags = 'atomic-forms' | 'all-forms' | 'form-submissions' | 'backend-forms' | 'image'

/** Tags whose revalidateTag call has a promise return type. */
export type PromiseTagGroup = 'draft' | 'published'
/** Tags that carry an id key. */
type IDTagGroup = 'page' | 'icon' | 'form-submissions' | 'image'
/** Tags that don't branch on draft / published. */
type NoDraftTagGroup = 'backend-forms' | 'form-submissions' | 'draft' | 'published' | 'image'

export type AllTags = CSSTags | GlobalsTags | IconTags | FrontEndTags | PageTags | FormsTags | CollectionsTags | CacheTags

type Tag<T extends AllTags> = T extends NoDraftTagGroup
  ? T extends IDTagGroup
    ? [T, tid: string]
    : [T]
  : T extends IDTagGroup
    ? [T, tid: string, draft: boolean]
    : [T, draft: boolean]

// /////////////////////////////////////
// Revalidate Tag Function Types
// /////////////////////////////////////

export type RevalidateTagType =
  | { args: Tag<'page'>; return: void }
  | { args: Tag<'icon'>; return: void }
  | { args: Tag<'image'>; return: void }
  | { args: Tag<'pages'>; return: void }
  | { args: Tag<'header'>; return: void }
  | { args: Tag<'footer'>; return: void }
  | { args: Tag<'sitemap'>; return: void }
  | { args: Tag<'iconSet'>; return: void }
  | { args: Tag<'site-css'>; return: void }
  | { args: Tag<'tracking'>; return: void }
  | { args: Tag<'settings'>; return: void }
  | { args: Tag<'all-forms'>; return: void }
  | { args: Tag<'designSet'>; return: void }
  | { args: Tag<'shortcutSet'>; return: void }
  | { args: Tag<'icon-options'>; return: void }
  | { args: Tag<'atomic-forms'>; return: void }
  | { args: Tag<'backend-forms'>; return: void }
  | { args: Tag<'site-metadata'>; return: void }
  | { args: Tag<'atomic-classes'>; return: void }
  | { args: Tag<'atomic-actions'>; return: void }
  | { args: Tag<'form-submissions'>; return: void }
  | { args: Tag<'draft'>; return: RevalidateTagResponse }
  | { args: Tag<'published'>; return: RevalidateTagResponse }

/** Pass-through arguments for the revalidateTag function. `'all'` yields every tag's args (for the overload). */
export type RArgs<T extends AllTags | 'all'> = T extends AllTags ? Extract<RevalidateTagType, { args: Tag<T> }>['args'] : RevalidateTagType['args']

/** Return type of the revalidateTag function. `'all'` yields every tag's return (for the overload). */
export type RReturns<T extends AllTags | 'all'> = Promise<
  T extends AllTags ? Extract<RevalidateTagType, { args: Tag<T> }>['return'] : RevalidateTagType['return']
>

// /////////////////////////////////////
// Miscellaneous Types
// /////////////////////////////////////

export type RevalidationLoggerType = string[]
