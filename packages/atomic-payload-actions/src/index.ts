export { actionsPlugin, default } from './plugin'
export type { ActionsPluginOptions } from './plugin'

// Re-export the action type surface from atomic-payload-types so consumers
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
} from '@pro-laico/atomic-payload-types'
