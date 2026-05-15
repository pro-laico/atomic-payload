/**
 * Augments Payload's `RequestContext` with the `storedAtomicClasses` array the
 * CSS processor populates during a request. Side-effect imported from
 * `src/index.ts`.
 */
declare module 'payload' {
  export interface RequestContext {
    storedAtomicClasses?: string[]
  }
}

export {}
