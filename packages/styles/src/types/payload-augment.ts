/**
 * Schema stubs owned by `@pro-laico/styles`.
 */
import type { DefaultRecord, Get } from '@pro-laico/core'

export type DesignSet = Get<'DesignSet', DefaultRecord>
export type ShortcutSet = Get<'ShortcutSet', DefaultRecord>
export type CollectionThatUsesCSSProcessorSlug = Get<'CollectionThatUsesCSSProcessorSlug', string>
export type CollectionWithStoredAtomicClassesSlug = Get<'CollectionWithStoredAtomicClassesSlug', string>
