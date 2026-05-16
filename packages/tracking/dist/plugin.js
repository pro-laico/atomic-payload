import { PostHogProperty } from './collections/posthogProperty';
import { Tracking } from './globals/tracking';
export const trackingPlugin = (opts = {}) => (config) => {
    const { enabled = true, addPropertyCollection = true, addTrackingGlobal = true } = opts;
    if (!enabled)
        return config;
    return {
        ...config,
        collections: [...(config.collections ?? []), ...(addPropertyCollection ? [PostHogProperty] : [])],
        globals: [...(config.globals ?? []), ...(addTrackingGlobal ? [Tracking] : [])],
    };
};
export default trackingPlugin;
//# sourceMappingURL=plugin.js.map