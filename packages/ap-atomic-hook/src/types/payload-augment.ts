/**
 * Schema stubs owned by `@pro-laico/ap-atomic-hook`.
 */
import type { Get } from '@pro-laico/ap-types'

export type ImplementedStorageTypes = Get<'ImplementedStorageTypes', string | number | boolean | Record<string, any> | undefined>
export type CollectionThatUsesCSSProcessorSlug = Get<'CollectionThatUsesCSSProcessorSlug', string>
export type CollectionWithStoredAtomicClassesSlug = Get<'CollectionWithStoredAtomicClassesSlug', string>
