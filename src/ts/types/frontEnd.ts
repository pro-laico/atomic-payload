// Front End Types
import type { ReactNode } from 'react'
import type { ChildBlocks } from '@/ts/types'

// /////////////////////////////////////
// UTILITY FUNCTION TYPES
// /////////////////////////////////////

export type Apply = Record<string, unknown>

export interface AtomicChildReturn {
  /** Props That Can Be Applied To Trigger */
  tp: Apply
  /**  Props That Can Be Applied To Backdrop */
  bp: Apply
}

export type PassThrough = {
  /** Props that should be spread on target element */
  p?: Record<string, unknown>
  /** Children */
  children?: ReactNode
  /** Data Attributes that should be spread on target element*/
  da?: Record<string, string>
}

export type PassThroughs = {
  /** Content Pass Throughs */
  c: PassThrough
  /** Trigger Pass Throughs */
  t: PassThrough
  /** Portal Pass Throughs */
  po: {
    /** Backdrop Pass Throughs */
    b: Omit<PassThrough, 'da'>
    /** Dialog Pass Throughs */
    di: Omit<PassThrough, 'children' | 'da'>
    /** Popover Pass Throughs */
    pop: Omit<PassThrough, 'children' | 'da'>
  }
}

// /////////////////////////////////////
// CHILD TYPES
// /////////////////////////////////////

/** Used for base ui custom components. */
export interface RenderChild<T extends ChildBlocks[number] | ChildBlocks> {
  /** The block being rendered */
  block: T
  /** All Possible Pass Throughs. Includes spreadable props, children components, and data attributes. */
  pt: PassThroughs
  contentChildren?: ReactNode
  triggerChildren?: ReactNode
  backdropChildren?: ReactNode
}

/** {@link RenderChildrenProps} */
export type RenderChildrenProps = React.FC<{
  blocks?: ChildBlocks | null
}>

// /////////////////////////////////////
// ATOMIC STORE TYPES
// /////////////////////////////////////

type PersistedProp = boolean | null | undefined
export type ImplementedStorageTypes = boolean | string | Record<string, string>

export type AtomicStoreInitialState = {
  version: number
  //storedAtomicActions: StoredAtomicActions
}

export interface AtomicStoreProviderProps {
  children: ReactNode
  initialState: AtomicStoreInitialState
}

export type BaseSlice = {
  hydrated: boolean
  setHydrated: (hydrated: boolean) => void
}

export interface DynamicSlice {
  memory: Record<string, ImplementedStorageTypes>
  persisted: Record<string, ImplementedStorageTypes>
  removeValue: (key: string, persisted: PersistedProp) => void
  getValue: (key: string, persisted: PersistedProp) => ImplementedStorageTypes
  setValue: (key: string, value: ImplementedStorageTypes, persisted: PersistedProp) => void
  //clearStorage: (persisted: PersistedProp) => void
  //setMultiple: (entries: Array<{ key: string; value: ImplementedStorageTypes; persisted: PersistedProp }>) => void
  //getMultiple: (keys: Array<{ key: string; persisted: PersistedProp }>) => Record<string, ImplementedStorageTypes>
}

export interface ConsentPreferences {
  functional: boolean
  security: boolean
  analytics: boolean
  marketing: boolean
  userData: boolean
  adPersonalization: boolean
  contentPersonalization: boolean
}

export interface ConsentSlice {
  hasConsented: boolean | null
  preferences: ConsentPreferences
  previouslyConsented: boolean | null
  declineCookies: () => void
  acceptCookies: (preferences?: Partial<ConsentPreferences>) => void
  setPreference: (category: keyof ConsentPreferences, value: boolean) => void
}

export type AtomicStore = BaseSlice & ConsentSlice & DynamicSlice
