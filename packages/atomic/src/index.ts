// Root barrel for @pro-laico/atomic. Re-exports the four namespace plugins (and a
// curated set of their value/type exports). For finer-grained imports prefer the
// namespace subpaths: `@pro-laico/atomic/{actions,hook,forms,children}` and their
// sub-subpaths declared in this package's `exports` map.

export type { ActionsPluginOptions } from './actions'
export { ActionBlockStorageProcessor, ActionBlockType, ActionFilters, ActionOptions, AllActionBlocks, actionsPlugin } from './actions'
export type { ChildBlocksPluginOptions } from './children'
export { ChildrenBlocksField, childBlocks, childBlocksPlugin, childBlocksZapSchemas } from './children'
export type { FormsPluginOptions } from './forms'
export { defaultSubmitFormBlocks, formsPlugin } from './forms'
export type {
  ActionBlockStorageProcessorClass,
  AtomicHookGetCached,
  AtomicHookPluginOptions,
  CreateAtomicHookOptions,
  UnsetActiveType,
} from './hook'
export {
  atomicHook,
  atomicHookPlugin,
  createAtomicHook,
  createCssProcessor,
  manualLogger,
  processDesignSet,
  sanitizeData,
  unsetActive,
} from './hook'
