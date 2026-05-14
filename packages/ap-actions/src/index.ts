export { actionsPlugin, default } from './plugin'
export type { ActionsPluginOptions } from './plugin'

export { AllActionBlocks } from './blocks/blocks'
export { ActionBlockType } from './blocks/zap'
export { ActionFilters } from './blocks/filters'
export { ActionBlockStorageProcessor, ActionOptions } from './blocks/processor'

// Re-export the action type surface from ap-types so consumers
// of this package have a single import surface for action authoring.
export type {
  ActionContext,
  ActionBlockPrefix,
  ActionBlockFilter,
  ActionBlockDefaultReturns,
  ActionBlockOptions,
  ActionBlockMap,
  ActionClass,
  ActionProcessFunction,
  ActionDefaultFunction,
  ActionSetKeyInitialByAction,
  ActionSetKeyInitialByBlock,
  InitialValue,
  CookiePreferences,
  FullFormContext,
  AttFunction,
  AttFunctionReturns,
  RunFunction,
  RunFunctionReturns,
} from '@pro-laico/ap-types'
