/**
 * Augments Payload's `RequestContext` with the document keys that ap-site's
 * own `atomicHook`-using collections (pages/header/footer) populate during a
 * request. Side-effect imported from `src/index.ts` so any consumer of the
 * package picks up the augmentation.
 */
import type { Footer, Header, Page } from '@pro-laico/site/schema'

declare module 'payload' {
  export interface RequestContext {
    pages?: Page
    header?: Header
    footer?: Footer
  }
}
