// Root barrel for @pro-laico/atomic. Re-exports the four namespace plugins (and a
// curated set of their value/type exports). For finer-grained imports prefer the
// namespace subpaths: `@pro-laico/atomic/{actions,hook,forms,children}` and their
// sub-subpaths declared in this package's `exports` map.

export type { FormsPluginOptions } from './forms'
export { defaultSubmitFormBlocks, formsPlugin } from './forms'

export type { BuildChildBlocksOptions, ChildBlocksPluginOptions, GenericChildBlockSlug } from './children'
export { buildChildBlocks, ChildrenBlocksField, childBlocks, childBlocksPlugin, childBlocksZapSchemas } from './children'

export type { ActionsPluginOptions } from './actions'
export { ActionBlockStorageProcessor, ActionBlockType, ActionFilters, ActionOptions, AllActionBlocks, actionsPlugin } from './actions'

export { atomicHook, atomicHookPlugin, createAtomicHook, unsetActive } from './hook'
export type {
  ActionBlockStorageProcessorClass,
  AtomicHookGetCached,
  AtomicHookPluginOptions,
  CreateAtomicHookOptions,
  UnsetActiveType,
} from './hook'
