# Atomic Payload Styles Plugin

The single home for all CSS handling in Atomic Payload: the `designSet` + `shortcutSet` collections, token fields and admin row-labels, and the runtime UnoCSS processor that turns the active design set into CSS for both the frontend and Payload's admin. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/plugins/styles)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/packages/styles)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/plugins/styles.mdx)

## Atomic Payload dependencies

- `@pro-laico/core` — shared kernel the plugin builds on.
- `@pro-laico/zap` — the schema registry that wires the design-set / shortcut-set type stubs.
- `@pro-laico/site` — type-only relationship for the fields/slugs the processor reads.

## Exports

| Import | What's there |
| --- | --- |
| `@pro-laico/styles` | `stylesPlugin` (registers both collections + CSS storage globals), plus top-level `createCssHook` / `CssHookOptions`. |
| `@pro-laico/styles/schema` | Schema stubs (`DesignSet`, `CollectionThatUsesCSSProcessorSlug`, `CollectionWithStoredAtomicClassesSlug`) for the `PayloadAugment` registry. |
| `@pro-laico/styles/cssProcessor` | `createCssProcessor` + its `CssProcessorGetCached` / `CssProcessorOptions` types. |
| `@pro-laico/styles/processDesignSet` | `processDesignSet` directly. |
| `@pro-laico/styles/designSet/tabs/colors` | Color tab (`ColorsTab`) + `designSetColors` / `UnoColors` schemas. |
| `@pro-laico/styles/designSet/defaults` | `defaultAtomicClasses` + `defaultAria`. |
| `@pro-laico/styles/fields/value` | Token value fields (`ValueField`, `ValuesField`, `TokenValueArrayField`, `TokenValuesArrayField`) + `TokenString` / `TokenStringArray` schemas. |
| `@pro-laico/styles/fields/className` | The `ClassNameField` factory. |
| `@pro-laico/styles/globals/storage` | `baseStorage` — factory for the `draftStorage` / `publishedStorage` CSS globals. |
| `@pro-laico/styles/hooks/cssHook` | The standalone CSS hook (`createCssHook` + `CssHookOptions`). |
| `@pro-laico/styles/ui/rowLabels/shortcut` | Admin row-label React component for shortcuts. |
| `@pro-laico/styles/ui/rowLabels/color` | Admin row-label React component for colors. |
| `@pro-laico/styles/ui/rowLabels/animation` | Admin row-label React component for animations. |
| `@pro-laico/styles/ui/rowLabels/designToken` | Admin row-label React component for design tokens. |
