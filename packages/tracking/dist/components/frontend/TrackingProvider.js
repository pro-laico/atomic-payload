'use client';
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { GoogleTagManagerProvider } from './GoogleTagManagerProvider';
import { PostHogProvider } from './PostHogProvider';
import { VercelProvider } from './VercelProvider';
const providerRegistry = {
    vercel: ({ children }) => _jsx(VercelProvider, { children: children }),
    postHog: ({ children, tracking }) => _jsx(PostHogProvider, { tracking: tracking, children: children }),
    googleTagManager: ({ children, tracking }) => _jsx(GoogleTagManagerProvider, { tracking: tracking, children: children }),
};
export const TrackingProvider = ({ tracking, children }) => {
    if (!tracking)
        return _jsx(_Fragment, { children: children });
    const activeProviders = {
        postHog: tracking.postHogEnabled,
        vercel: tracking.vercelAnalyticsEnabled,
        googleTagManager: tracking.googleTagManagerEnabled,
    };
    const validProviders = Object.entries(activeProviders)
        .filter(([, isActive]) => Boolean(isActive))
        .map(([type]) => type);
    return validProviders.reduceRight((acc, type) => {
        const Provider = providerRegistry[type];
        return (_jsx(Provider, { tracking: tracking, children: acc }, type));
    }, children);
};
export default TrackingProvider;
//# sourceMappingURL=TrackingProvider.js.map