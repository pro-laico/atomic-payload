// /////////////////////////////////////
// Types For Actions
// /////////////////////////////////////
import type { UseThemeProps } from 'next-themes'
import type {
  Runners,
  AllActions,
  Attributer,
  RunnerType,
  Attributers,
  ChildBlocks,
  AtomicStore,
  ActionBlocks,
  FormResponse,
  ChildBlockType,
  AttributerType,
  ActionBlockType,
  AtomicInputTypes,
  AtomicButtonTypes,
  AtomicChildVariants,
  AtomicButtonPortalTypes,
} from '@/ts/types'

// /////////////////////////////////////
// Action General Types
// /////////////////////////////////////

export interface CookiePreferences {
  functional: boolean
  security: boolean
  analytics: boolean
  marketing: boolean
  userData: boolean
  adPersonalization: boolean
  contentPersonalization: boolean
}

export type FullFormContext = {
  submissionId?: string | null
  formResponse?: FormResponse | null
  formRef?: React.RefObject<HTMLFormElement | null> | null
}

export type ActionContext = {
  theme?: UseThemeProps
  atomicStore: AtomicStore
  fullFormContext?: FullFormContext
}

export type ActionBlockPrefix = 'content' | 'trigger'

/** Used In UI Components Filter For Action Blocks */
export type ActionBlockFilter = {
  blockType: ChildBlockType
  type?: AtomicChildVariants
  placement: ActionBlockPrefix
  inputType?: AtomicInputTypes
  buttonType?: AtomicButtonTypes
  portalType?: AtomicButtonPortalTypes
}

/** The name and types of action function storage, and what action processors use to mutate context.*/
export type ActionBlockDefaultReturns = { actions: ActionBlockType[]; runners: Runners; attributers: Attributers }

/** Returns any type or array of types with the dispatcher context added */
export type WithContext<T> = T extends unknown[] ? { [K in keyof T]: { action: T[K][]; context: ActionContext } } : T & { context: ActionContext }

// /////////////////////////////////////
// Attributes
// /////////////////////////////////////

export type AttFunctionReturns = Record<string, string> | undefined

/** Returns attributer function type or array of function types. Pass function type or array of function types*/
export type GetBaseAtt<T extends AttributerType | AttributerType[]> = T extends AttributerType[]
  ? { [K in keyof T]: Extract<Attributer, { type: T[K] }> }
  : Extract<Attributer, { type: T }>

/** Returns attributer function type with the dispatcher context added. Pass function type or array of function types*/
export type GetFullAtt<T extends AttributerType | AttributerType[]> = T extends AttributerType[]
  ? { actions: GetBaseAtt<T> | undefined; context: ActionContext }
  : WithContext<GetBaseAtt<T>>

/** Function type that takes attributer function types as parameters and returns Record<string, string> */
export type AttFunction<T extends AttributerType | AttributerType[]> = (args: GetFullAtt<T>) => AttFunctionReturns

// /////////////////////////////////////
// Runners
// /////////////////////////////////////

type RunFunctionReturnsBase = { success: true } | { success: false; message: string }
export type RunFunctionReturns = Promise<RunFunctionReturnsBase> | RunFunctionReturnsBase

/** Returns runner function type. Pass function type or array of function types*/
export type GetBaseRun<T extends RunnerType | RunnerType[]> = T extends RunnerType[]
  ? { [K in keyof T]: Extract<Runners[number], { type: T[K] }> }
  : Extract<Runners[number], { type: T }>

/** Returns runner function type with the dispatcher context added. Pass function type or array of function types*/
export type GetFullRun<T extends RunnerType | RunnerType[]> = T extends RunnerType[]
  ? { actions: GetBaseRun<T> | undefined; context: ActionContext }
  : WithContext<GetBaseRun<T>>

/** Function type that takes runner function types as parameters and returns Record<string, string> */
export type RunFunction<T extends RunnerType | RunnerType[]> = (args: GetFullRun<T>) => RunFunctionReturns

// /////////////////////////////////////
// Options
// /////////////////////////////////////

type SetKeyContext = { block: ChildBlocks[number]; initialValuesMap: Map<string, InitialValue> }

type ProcessFunctionContext = {
  block: ChildBlocks[number]
  data: NonNullableObject<AllActions>
  initialValuesMap: Map<string, InitialValue>
  /** If a parent has a form name, you can use it with this. */
  useForm?: string
  /** If a parent has a portal name, you can use it with this. */
  usePortal?: string
}

type WithProcessFunctionContext<T> = T extends unknown[]
  ? { [K in keyof T]: { actionBlock: T[K][]; context: ProcessFunctionContext } }
  : T & ProcessFunctionContext

//Establish Base Types
type GetBaseAction<T extends ActionBlockType | ActionBlockType[]> = T extends ActionBlockType[]
  ? { [K in keyof T]: Extract<ActionBlocks[number], { blockType: T[K] }> }
  : Extract<ActionBlocks[number], { blockType: T }>

type GetActionsProcessFunction<T extends ActionBlockType | ActionBlockType[]> = T extends ActionBlockType[]
  ? { actionBlock: GetBaseAction<T>; context: ProcessFunctionContext }
  : WithProcessFunctionContext<GetBaseAction<T>>

export type ActionSetKeyInitialByAction<T extends ActionBlockType> = (
  args: SetKeyContext & { actionBlock: GetBaseAction<T> },
) => InitialValue | undefined

export type ActionSetKeyInitialByBlock = (args: SetKeyContext) => InitialValue | undefined
export type ActionProcessFunction<T extends ActionBlockType | ActionBlockType[]> = (args: GetActionsProcessFunction<T>) => void
export type ActionDefaultFunction = (args: ProcessFunctionContext) => void

export type ActionBlockMap = { [T in ActionBlocks[number] as T['blockType']]: T }
export type InitialValue = { key: string; initialValue?: boolean | string | null; persisted?: boolean | null }

type OptionFunctionArgs = (args: {
  block: ChildBlocks[number]
  initialValuesMap: Map<string, InitialValue>
  result: ActionBlockDefaultReturns
  actionBlock: ActionBlocks[number]
  useForm?: string
  usePortal?: string
}) => void

export type ActionBlockOptions = {
  processFunction: OptionFunctionArgs
  triggerDefaults?: OptionFunctionArgs
  contentDefaults?: OptionFunctionArgs
  setKeyInitialByBlock?: ActionSetKeyInitialByBlock
  setKeyInitialByAction?: ActionSetKeyInitialByAction<ActionBlockType>
}

type ProcessFunctionArgs = (args: {
  block: ChildBlocks[number]
  allActions: NonNullableObject<AllActions>
  actionBlock: ActionBlocks[number]
  result: ActionBlockDefaultReturns
}) => void

export interface ActionClass {
  processFunction: ProcessFunctionArgs
  triggerDefaults?: ProcessFunctionArgs
  contentDefaults?: ProcessFunctionArgs
}
