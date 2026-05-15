// Root barrel for @pro-laico/atomic. Re-exports the four namespace plugins (and a
// curated set of their value/type exports). For finer-grained imports prefer the
// namespace subpaths: `@pro-laico/atomic/{actions,hook,forms,children}` and their
// sub-subpaths declared in this package's `exports` map.

export { actionsPlugin, AllActionBlocks, ActionBlockType, ActionFilters, ActionBlockStorageProcessor, ActionOptions } from './actions'
export type { ActionsPluginOptions } from './actions'

export {
  atomicHookPlugin,
  createAtomicHook,
  atomicHook,
  unsetActive,
  createCssProcessor,
  processDesignSet,
  sanitizeData,
  manualLogger,
} from './hook'
export type {
  AtomicHookPluginOptions,
  AtomicHookGetCached,
  CreateAtomicHookOptions,
  ActionBlockStorageProcessorClass,
  UnsetActiveType,
} from './hook'

export { formsPlugin, defaultSubmitFormBlocks } from './forms'
export type { FormsPluginOptions } from './forms'

export { childBlocksPlugin, childBlocks, childBlocksZapSchemas, ChildrenBlocksField } from './children'
export type { ChildBlocksPluginOptions } from './children'
