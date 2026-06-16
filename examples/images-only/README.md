# Atomic Payload — Images Only Example

A minimal Atomic Payload example that demonstrates the `@pro-laico/images` plugin in isolation — the `Images` collection, the on-demand transform endpoint, focal-point cropping, and the responsive `<ResponsiveImage>` component, plus a small Next.js page that renders them. Standalone: it uses only `@pro-laico/core`, not `@pro-laico/atomic`. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/examples/images-only)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/examples/images-only)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/examples/images-only.mdx)

## Quick start

```bash
npx @pro-laico/create-atomic-payload my-images --template images-only
```

## Atomic Payload packages used

- `@pro-laico/images` — the `Images` collection, the on-demand transform endpoint (`/api/img/:id`), built-in blur placeholders, and the bundled `<ResponsiveImage>` component.
- `@pro-laico/core` — cache/revalidation helpers (pulled in by `@pro-laico/images`).
