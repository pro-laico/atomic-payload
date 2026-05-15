/**
 * Augments zod's `GlobalMeta` with the discriminator fields zap places on
 * registered schemas (action/runner/attributer kinds for actions, block kinds
 * for child/form blocks). Side-effect imported from `src/index.ts`.
 */
declare module 'zod' {
    interface GlobalMeta {
        function?: 'Attributer' | 'Runner';
        block?: 'Child' | 'Action' | 'FormRL' | 'FormV' | 'FormS' | 'InputV' | 'InputS';
    }
}
export {};
//# sourceMappingURL=zod.d.ts.map