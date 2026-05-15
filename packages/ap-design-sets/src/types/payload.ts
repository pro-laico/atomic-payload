/**
 * Augments Payload's `RequestContext` with the design-set / shortcut-set
 * documents the CSS processor stores during a request. Side-effect imported
 * from `src/index.ts`.
 */
import type { DesignSet } from '@pro-laico/ap-design-sets/schema'
import type { ShortcutSet } from '@pro-laico/ap-site/schema'
declare module 'payload' {
  export interface RequestContext {
    designSet?: DesignSet
    shortcutSet?: ShortcutSet
  }
}

export {}
