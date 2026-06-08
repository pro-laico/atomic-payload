export type { TrackingPluginOptions } from './plugin'
export { default, trackingPlugin } from './plugin'
// Client-only React components (PostHogProvider, GoogleTagManagerProvider,
// VercelProvider, TrackingProvider) live under the '@pro-laico/tracking/provider'
// subpath. Server tooling (e.g. payload generate:importmap) resolves the package
// under the react-server condition, where posthog-js / @next/third-parties /
// @vercel/analytics aren't safe to load.
