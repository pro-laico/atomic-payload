import type { Plugin } from 'payload';
export interface PostHogPluginOptions {
    enabled?: boolean;
    /** Whether to add the posthogProperty collection. Defaults to true. */
    addPropertyCollection?: boolean;
}
export declare const posthogPlugin: (opts?: PostHogPluginOptions) => Plugin;
export default posthogPlugin;
//# sourceMappingURL=plugin.d.ts.map