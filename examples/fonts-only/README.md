# Atomic Payload — Fonts Only Example

A minimal Atomic Payload example that demonstrates the `@pro-laico/fonts` plugin in isolation — upload font files to the `Font` collection, pick the active four in the `fontSet` global, and the site renders them. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/examples/fonts-only)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/examples/fonts-only)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/examples/fonts-only.mdx)

## Quick start

```bash
npx @pro-laico/create-atomic-payload my-fonts --template fonts-only
```

## Atomic Payload packages used

- `@pro-laico/fonts` — the `Font` collection, the `fontSet` active-selection global, and the `download:fonts` CLI.
- `@pro-laico/core` — the kernel and `core-augment-types` (used in `generate:types`).
