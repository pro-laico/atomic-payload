import { PostHogProperty } from './collections/posthogProperty';
export const posthogPlugin = (opts = {}) => (config) => {
    const { enabled = true, addPropertyCollection = true } = opts;
    if (!enabled)
        return config;
    return {
        ...config,
        collections: [...(config.collections ?? []), ...(addPropertyCollection ? [PostHogProperty] : [])],
    };
};
export default posthogPlugin;
//# sourceMappingURL=plugin.js.map