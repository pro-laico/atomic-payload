export { posthogPlugin, default } from './plugin'
export type { PostHogPluginOptions } from './plugin'
export { PostHogProperty } from './collections/posthogProperty'
export { postHogTabField } from './globals/postHogTab'
export { postHogPropertyApplicator } from './utilities/propertyApplicatorUtility'
// PostHogProvider is a client-only React component — import it from the
// '@pro-laico/atomic-payload-posthog/provider' subpath instead, so server
// tooling (e.g. payload generate:importmap) doesn't try to resolve posthog-js
// under the package's react-server condition.
