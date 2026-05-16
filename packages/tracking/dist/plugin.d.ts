import type { Plugin } from 'payload';
export interface TrackingPluginOptions {
    enabled?: boolean;
    /** Whether to add the posthogProperty collection. Defaults to true. */
    addPropertyCollection?: boolean;
    /** Whether to add the Tracking global. Defaults to true. */
    addTrackingGlobal?: boolean;
}
export declare const trackingPlugin: (opts?: TrackingPluginOptions) => Plugin;
export default trackingPlugin;
//# sourceMappingURL=plugin.d.ts.map