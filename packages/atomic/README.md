# Atomic Payload Runtime

The runtime that turns Payload content into a working website — action blocks, the beforeChange hook with CSS/UnoCSS processor, the form submission pipeline, and the child blocks plugin, all in one package. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/plugins/atomic)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/packages/atomic)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/plugins/atomic.mdx)

## Atomic Payload dependencies

- `@pro-laico/core` — primitives the runtime builds on (read this first).
- `@pro-laico/styles` — the CSS / UnoCSS processor (`createCssProcessor`) the hook runs against the design set.
- `@pro-laico/icons` — `IconChild` / `SVGChild` block factories in the default child set.
- `@pro-laico/images` — `ImageChild` block factory in the default child set.
- `@pro-laico/mux-video` — `VideoChild` block factory in the default child set.
- `@pro-laico/richtext` — `RichTextChild` block factory in the default child set.
- `@pro-laico/site` — collection shapes the runtime attaches to.
- `@pro-laico/zap` — zap schemas for blocks.

## Exports

| Import | What's there |
| --- | --- |
| `@pro-laico/atomic` | Root barrel — the four plugin factories (`childBlocksPlugin`, `actionsPlugin`, `formsPlugin`, `atomicHookPlugin`) plus curated value/type exports. |
| `@pro-laico/atomic/actions` | Action blocks (theme toggle, form submit, cookie consent, dynamicStore, portal): `actionsPlugin`, `AllActionBlocks`, `ActionFilters`, `ActionBlockStorageProcessor`, action field builders. |
| `@pro-laico/atomic/hook` | The `beforeChange` orchestrator that runs CSS/UnoCSS through the design-set pipeline: `atomicHookPlugin`, `atomicHook`, `createAtomicHook`, `atomicHookWith`. |
| `@pro-laico/atomic/hook/client` | The client zustand `AtomicStore` binding (`AtomicStoreProvider`, `useAtomicStore`, `createAtomicStore`). |
| `@pro-laico/atomic/forms` | Form & input submission with sanitation, validation, and rate limiting: `formsPlugin`, `defaultSubmitFormBlocks`, form types. |
| `@pro-laico/atomic/forms/submitForm/serverFunction` | The `submitForm` server action (kept off the barrel to avoid circular init). |
| `@pro-laico/atomic/children` | The recursive child blocks plugin: `childBlocksPlugin`, `buildChildBlocks`, `childBlocks`, `ChildrenBlocksField`. |
| `@pro-laico/atomic/children/render` | Front-end tree renderer (`RenderChildren`, `SSRProps`). |
