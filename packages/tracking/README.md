# Atomic Payload Tracking Plugin

Analytics and tag-manager integration for Atomic Payload: a Tracking global (PostHog, Google Tag Manager, and Vercel Analytics tabs with per-provider toggles) and React providers you compose at the app root. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/plugins/tracking)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/packages/tracking)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/plugins/tracking.mdx)

## Atomic Payload dependencies

- `@pro-laico/core` — kernel types and shared primitives.

## Exports

| Import | What's there |
| --- | --- |
| `@pro-laico/tracking` | The barrel: `trackingPlugin`, the `Tracking` global, and tab fields. |
| `@pro-laico/tracking/schema` | Payload `Tracking` type augmentation stub. |
| `@pro-laico/tracking/provider` | All React providers: `PostHogProvider`, `GoogleTagManagerProvider`, `VercelProvider`, and the composite `TrackingProvider`. |
