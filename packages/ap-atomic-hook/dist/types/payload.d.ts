/**
 * Augments Payload's `RequestContext` with the `storedAtomicClasses` array the
 * CSS processor populates during a request. Side-effect imported from
 * `src/index.ts`.
 */
declare module 'payload' {
    interface RequestContext {
        storedAtomicClasses?: string[];
    }
}
export {};
//# sourceMappingURL=payload.d.ts.map