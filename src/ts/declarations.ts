import { DesignSet, Footer, Header, Page, ShortcutSet } from '@/ts/types'

declare module 'payload' {
  export interface RequestContext {
    pages?: Page
    header?: Header
    footer?: Footer
    designSet?: DesignSet
    shortcutSet?: ShortcutSet
    storedAtomicClasses?: string[]
  }
}

declare module 'zod' {
  interface GlobalMeta {
    function?: 'Attributer' | 'Runner'
    block?: 'Child' | 'Action' | 'FormRL' | 'FormV' | 'FormS' | 'InputV' | 'InputS'
  }
}

declare global {
  /** Makes an object and all its properties non-nullable */
  type NonNullableObject<T> = { [K in keyof T]-?: NonNullable<T[K]> }
}
