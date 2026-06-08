# Atomic Payload Runtime

The runtime that turns Payload content into a working website — action blocks, the beforeChange hook with CSS/UnoCSS processor, the form submission pipeline, and the child blocks plugin, all in one package. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/plugins/atomic)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/packages/atomic)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/plugins/atomic.mdx)

## Features

### Recursive Structure + Copy Paste Duplicate

Build entire custom components using Atomic Child Blocks. Combined with Payload's CPD functionality, you can reuse components with ease.

![duplicate](https://github.com/user-attachments/assets/f9a6580b-ab82-4e7b-8815-9fbed20e576b)

> [!NOTE]
> Once Payload CMS implements Sanity Style CPD, you will be able to reuse components across projects.

### Actions

Actions create interactivity and reactivity for your application for all atomic blocks. Including functionality such as opening/closing dialogs/popovers, toggling dark mode, converting stateful values to data attributes, or just submitting a form.

![actions](https://github.com/user-attachments/assets/109a6f47-3f35-4a3d-af7f-f340bfdfb23d)

> [!NOTE]
> Actions utilize a block structure so you can extend them by adding a new action block.

### Custom Forms With SVR

All of the above functionality meshes with the additional Sanitation, Validation and Rate Limiting for forms and their inputs. Allowing you to build fully customizable forms.

![forms](https://github.com/user-attachments/assets/61a4fd29-0d0b-40ab-a2f0-1cfa698b5997)

> [!NOTE]
> SVR's utilize a block structure so you can extend them by adding a new SVR block.

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
| `@pro-laico/atomic` | Root barrel — the three block plugin factories (`childBlocksPlugin`, `actionsPlugin`, `formsPlugin`), the `ChildrenBlocksField`, and the ready-made `atomicHook`. |
| `@pro-laico/atomic/actions` | Action blocks (theme toggle, form submit, cookie consent, dynamicStore, portal): `actionsPlugin`, `AllActionBlocks`, `ActionFilters`, `ActionBlockStorageProcessor`. |
| `@pro-laico/atomic/hook` | The `beforeChange` orchestrator that runs CSS/UnoCSS through the design-set pipeline: `atomicHookPlugin`, `atomicHook`, `createAtomicHook`, `atomicHookWith`. |
| `@pro-laico/atomic/hook/client` | The client zustand `AtomicStore` binding (`AtomicStoreProvider`, `useAtomicStore`, `createAtomicStore`). |
| `@pro-laico/atomic/forms` | Form & input submission with sanitation, validation, and rate limiting: `formsPlugin`, `defaultSubmitFormBlocks`, form types. |
| `@pro-laico/atomic/forms/submitForm/serverFunction` | The `submitForm` server action (kept off the barrel to avoid circular init). |
| `@pro-laico/atomic/children` | The recursive child blocks plugin: `childBlocksPlugin`, `buildChildBlocks`, `childBlocks`, `ChildrenBlocksField`. |
| `@pro-laico/atomic/children/render` | Front-end tree renderer (`RenderChildren`, `SSRProps`). |
