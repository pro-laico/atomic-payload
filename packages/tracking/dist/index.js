export { trackingPlugin, default } from './plugin';
export { PostHogProperty } from './collections/posthogProperty';
export { Tracking } from './globals/tracking';
export { postHogTabField } from './globals/postHogTab';
export { googleTagManagerTabField } from './globals/gtmTab';
export { postHogPropertyApplicator } from './utilities/propertyApplicatorUtility';
// Client-only React components (PostHogProvider, GoogleTagManagerProvider,
// VercelProvider, TrackingProvider) live under the '@pro-laico/tracking/provider'
// subpath. Server tooling (e.g. payload generate:importmap) resolves the package
// under the react-server condition, where posthog-js / @next/third-parties /
// @vercel/analytics aren't safe to load.
//# sourceMappingURL=index.js.map