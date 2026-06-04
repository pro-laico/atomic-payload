# @pro-laico/atomic

> The runtime that turns Payload content into a working website. Action blocks, the beforeChange hook + CSS/UnoCSS processor, the form submission pipeline, and the child blocks plugin — all in one package.

## What this package is

`@pro-laico/atomic` is where Atomic Payload's actual behavior lives. While `core` provides primitives and `site` provides collection shapes, this package provides the **runtime** that ties content to interactivity, styles, and form processing. It bundles what used to be four independent packages:

| Namespace | What it does | Old name |
| --- | --- | --- |
| `@pro-laico/atomic/actions` | Action blocks (theme toggle, form submit, cookie consent, dynamicStore, portal), the action block storage processor, and shared field builders. | `ap-actions` |
| `@pro-laico/atomic/hook` | The `beforeChange` orchestrator that runs CSS / UnoCSS through the design-set pipeline, plus the zustand `AtomicStore` on the client. | `ap-atomic-hook` |
| `@pro-laico/atomic/forms` | Form & input submission with rate limiting, sanitation, and validation. Server action + `formProcessor`. | `ap-forms` |
| `@pro-laico/atomic/children` | The child blocks plugin (recursive nested content), render component, admin row labels, and shared field utilities. | `children` |

If you're trying to understand how a "block" in the Payload admin becomes styled HTML with working interactivity on the front-end, the answer is somewhere in this package.

## Why it exists as one package

The four namespaces above used to ship separately, but they're tightly coupled — actions register against forms, forms render inside child blocks, child blocks pass through the hook, the hook processes design-set CSS used by children, and so on. Splitting them caused circular workspace dependencies and version skew. Co-locating them in one package with four exported namespaces eliminates that without changing the import surface (you still pick the namespace you need).

## Quick start

The four plugin factories register independently. Block-registering plugins
(`childBlocksPlugin`, `actionsPlugin`, `formsPlugin`) each prepend their blocks to
`config.blocks`; the order they run controls the final order, so run them as
shown (children → actions → forms). `atomicHookPlugin` attaches the `beforeChange`
hook to the collections you name — it needs a `hook` (use the ready-made
`atomicHook`, or build one with `createAtomicHook` / `atomicHookWith`) and the
`collectionSlugs` to attach it to:

```ts
import { buildConfig } from 'payload'
import { childBlocksPlugin } from '@pro-laico/atomic/children'
import { actionsPlugin } from '@pro-laico/atomic/actions'
import { formsPlugin } from '@pro-laico/atomic/forms'
import { atomicHook, atomicHookPlugin } from '@pro-laico/atomic/hook'

export default buildConfig({
  plugins: [
    childBlocksPlugin(),
    actionsPlugin(),
    formsPlugin(),
    atomicHookPlugin({ hook: atomicHook, collectionSlugs: ['pages', 'designSet'] }),
  ],
})
```

You can also import the plugin factories from the package root — the root barrel
re-exports them plus a curated set of value/type exports. For everything else,
prefer the namespaced subpaths.

## What each namespace contains

### `/actions`

The set of "action blocks" Payload users can attach to interactive elements. Built-ins: theme toggle, form submit, cookie consent, dynamicStore, portal. Action blocks are stored as data on a block and executed on the client when their trigger fires.

- `ActionBlockStorageProcessor` — runs at beforeChange to normalize action data.
- `ActionFilters` — predicates for filtering which action blocks apply.
- `AllActionBlocks` — the package's default set of action blocks. `actionsPlugin` prepends these to `config.blocks`; pass `actionBlocks` to add more.

### `/hook`

The brain. `atomicHookPlugin` attaches a Payload `beforeChange` hook (built by `createAtomicHook`, or the ready-made `atomicHook`) to each collection in `collectionSlugs`. On change it:

1. Walks the document for class names, action blocks, and form/input data.
2. Runs the CSS / UnoCSS processor (`createCssProcessor` from `@pro-laico/styles`) against the active design set.
3. Persists generated CSS, stored classes, actions, and forms onto the document and revalidates the relevant cache tags.
4. Feeds the front-end zustand store (`AtomicStore`) so client components see the same state.

`createAtomicHook(opts)` takes `getCached` + an `ActionBlockStorageProcessor` and optional slug overrides (`pagesSlug`, `designSetSlug`, `cssStorageGlobals`, …, defaulting to `DEFAULT_ATOMIC_HOOK_SLUG_CONFIG`). The lazy `atomicHook` export wires those up with the template's conventional slugs and defers the UnoCSS import to first invocation; `atomicHookWith(slugConfig)` is the per-slug-configurable factory.

Sub-exports worth knowing:
- `@pro-laico/atomic/hook/client` — the zustand store binding for React (`AtomicStoreProvider`, `useAtomicStore`, `createAtomicStore`).

### `/forms`

End-to-end form processing. A `submit-form` action block + corresponding `input/*` child blocks plug into a server function (`@pro-laico/atomic/forms/submitForm/serverFunction`) that runs sanitation, validation, and rate limiting through SVR (Sanitation/Validation/Rate-limiting) blocks before invoking `formProcessor`.

Extending forms means adding a new SVR block — the architecture is intentionally block-based so the dashboard stays the source of truth.

### `/children`

The recursive content model. `childBlocksPlugin` registers the default child blocks and wires children into the action system so blocks in the tree can carry interactivity. The default set is built by `buildChildBlocks` from each sibling package's block factory and is bundled in (these are package `dependencies`, not optional plugins): `AtomicChild`, `SimpleTextChild`, `RichTextChild`, `ImageChild`, `VideoChild`, `IconChild`, `SVGChild`. Pass `childBlocks` to add more.

#### Generic field extension (CSS decoupling)

Child blocks no longer hard-depend on `@pro-laico/styles`. Each package now exports a block **factory** (`createIconBlock`, `createSvgBlock`, `createImageBlock`, `createVideoBlock`, `createRichTextBlock`, `createSimpleTextBlock`) that accepts generic `prependFields` / `appendFields` (the `BlockFieldExtensions` type from `@pro-laico/core`). Those fields are spread at the start / end of the block's primary (first) content tab. The block stays agnostic about what they are — the consumer passes the `@pro-laico/styles` `ClassNameField`, project-specific fields, or nothing. The static exports (`Icon`, `Image`, …) and the `childBlocks` array carry no extra fields.

Wire fields in per block via `blockFields` on the plugin (keyed by block slug):

```ts
import { childBlocksPlugin } from '@pro-laico/atomic/children'
import { ClassNameField } from '@pro-laico/styles'

childBlocksPlugin({
  blockFields: {
    SVGChild: { prependFields: [ClassNameField({ label: 'SVG Atomic Classes' })] },
    ImageChild: { prependFields: [ClassNameField({ label: 'Image Atomic Classes' })] },
    // …other blocks, any fields you like
  },
})
```

**`AtomicChild` is a special case** and is intentionally left on the older `classNameField` passthrough for now (its content / trigger / backdrop styling spots aren't covered by the generic `blockFields` mechanism). Pass `classNameField: ClassNameField` to supply it.

The `render` subpath provides the front-end pieces that walk the tree and render each child (`RenderChildren`, `SSRProps`).

## Plugin options

Each factory takes a single options object; all default to `{}` except `atomicHookPlugin`, which requires `hook` and `collectionSlugs`. Every plugin honors `enabled` (set `false` to no-op). The three block plugins prepend their blocks ahead of any blocks already on `config.blocks`.

`actionsPlugin(opts)`

| Option | Default | What it does |
| --- | --- | --- |
| `enabled` | `true` | No-op the plugin entirely. |
| `actionBlocks` | `[]` | Extra blocks merged after the default action blocks. |
| `blocks` | `[]` | Deprecated alias for `actionBlocks`. |

`formsPlugin(opts)`

| Option | Default | What it does |
| --- | --- | --- |
| `enabled` | `true` | No-op the plugin entirely. |
| `formBlocks` | `[]` | Extra form/input processing blocks merged after the defaults. |
| `blocks` | `[]` | Deprecated alias for `formBlocks`. |

`childBlocksPlugin(opts)`

| Option | Default | What it does |
| --- | --- | --- |
| `enabled` | `true` | No-op the plugin entirely. |
| `childBlocks` | `[]` | Extra child blocks merged after the defaults. |
| `blockFields` | `{}` | Per-block `prependFields` / `appendFields`, keyed by slug (`SimpleTextChild`, `RichTextChild`, `ImageChild`, `VideoChild`, `IconChild`, `SVGChild`). |
| `classNameField` | — | `ClassNameField` wrapper for the `AtomicChild` special case. |
| `extra` | `[]` | Deprecated alias for `childBlocks`. |

`atomicHookPlugin(opts)`

| Option | Default | What it does |
| --- | --- | --- |
| `enabled` | `true` | No-op the plugin entirely. |
| `hook` | — (required) | The `beforeChange` hook to attach (e.g. `atomicHook`, or `createAtomicHook(...)`). |
| `collectionSlugs` | — (required) | Collection slugs that should get the hook in their `beforeChange` array. |

## What lives in `src/`

| Path | What's there |
| --- | --- |
| `index.ts` | Root barrel — re-exports the four plugin factories + curated value/type exports. |
| `actions/plugin.ts` | `actionsPlugin` — prepends the default action blocks. |
| `actions/blocks/blocks.ts` | `AllActionBlocks` — the default action-block set (theme, cookie consent, form, dynamicStore, portal). |
| `actions/blocks/processor.ts` | `ActionBlockStorageProcessor`, `ActionOptions`. |
| `actions/blocks/filters.ts` | `ActionFilters` predicates. |
| `actions/fields/` | Action field builders, incl. the strict typed registry (`theme`, `cookieConsent`). |
| `hook/plugin.ts` | `atomicHookPlugin` — attaches the hook to `collectionSlugs`. |
| `hook/createAtomicHook.ts` | `createAtomicHook` — builds the `beforeChange` orchestrator. |
| `hook/lazyAtomicHook.ts` | `atomicHook` — ready-made lazy hook with template slug defaults. |
| `hook/atomicHookFactory.ts` | `atomicHookWith` — per-slug-config factory. |
| `hook/frontEnd/atomicStore/` | The client zustand `AtomicStore` (`AtomicStoreProvider`, `useAtomicStore`). |
| `forms/plugin.ts` | `formsPlugin`, `defaultSubmitFormBlocks` — the SVR (sanitation/validation/rate-limit) blocks. |
| `forms/submitForm/serverFunction.ts` | `submitForm` server action. |
| `forms/submitForm/formProcessor.ts` | `getSubmitFormProcessor` — runs the SVR pipeline. |
| `children/plugin.ts` | `childBlocksPlugin`. |
| `children/buildChildBlocks.ts` | `buildChildBlocks` — assembles the default block set from each package's factory. |
| `children/blocks.ts` | `childBlocks` — the default static child-block array. |
| `children/render/` | `RenderChildren`, `SSRProps` — front-end tree renderer. |
| `children/components/admin/` | Admin row labels and select/renderer components + their component-path constants. |
| `children/fields/` | Reusable field configs (`trackingTab`, `coloredEnd`, `tagType`, `settings` tab). |

## Subpath imports

The full list is in `package.json` `exports`; the public ones a consumer reaches for, grouped:

| Subpath | What's there |
| --- | --- |
| `./actions` | Actions barrel — `actionsPlugin`, `AllActionBlocks`, `ActionFilters`, `ActionBlockStorageProcessor`. |
| `./actions/blocks` | `AllActionBlocks` (the default action-block array). |
| `./actions/filters` / `./actions/processor` | `ActionFilters` / `ActionBlockStorageProcessor`. |
| `./actions/fields` | Action field builders. |
| `./actions/fields/strict/registry/theme` · `.../cookieConsent` | Strict typed registry entries. |
| `./actions/schema` | `payload-augment` type stub for action blocks. |
| `./actions/zap` | Zap schema for action blocks. |
| `./hook` | Hook barrel — `atomicHookPlugin`, `atomicHook`, `createAtomicHook`, `atomicHookWith`, `unsetActive`. |
| `./hook/client` | Client zustand store (`AtomicStoreProvider`, `useAtomicStore`, `createAtomicStore`). |
| `./hook/schema` | `payload-augment` type stub for the hook. |
| `./forms` | Forms barrel — `formsPlugin`, `defaultSubmitFormBlocks`, form types. |
| `./forms/submitForm/serverFunction` | The `submitForm` server action (kept off the barrel to avoid circular init). |
| `./forms/submitForm/formProcessor` | `getSubmitFormProcessor`, invoked after SVR passes. |
| `./forms/schema` | `payload-augment` types for stored forms/inputs. |
| `./children` | Children barrel — `childBlocksPlugin`, `buildChildBlocks`, `childBlocks`, `ChildrenBlocksField`. |
| `./children/render` | Front-end child renderer (`RenderChildren`, `SSRProps`). |
| `./children/frontend-components` | The per-block front-end components (server + client variants). |
| `./children/admin` · `./children/admin/*` | Admin component-path constants and the individual renderers (row labels, action/input block, iconSelect, coloredEnd). |
| `./children/fields/trackingTab` · `coloredEnd` · `tagType` · `tabs/settings` | Reusable field/tab configs. |
| `./children/schema` · `./children/zap` | `payload-augment` types and zap schemas for child blocks. |

## Peer dependencies

| Peer | Optional | When you need it |
| --- | --- | --- |
| `payload` | — | Always (host CMS). |
| `next` | — | Always (server actions, `next/headers`, etc.). |
| `react` / `react-dom` | — | Always (admin + front-end components). |
| `@payloadcms/ui` | — | Admin components. |
| `@payloadcms/richtext-lexical` | — | Rich-text child block. |
| `server-only` | — | Guards server modules. |
| `unocss` | optional | The CSS / UnoCSS processor in the hook. |
| `zustand` | optional | The front-end `AtomicStore` client binding. |
| `@mux/blurup` | optional | Mux video blurhash placeholders. |
| `@pro-laico/tracking` | optional | Tracking integration for child blocks. |

## Where it sits in the monorepo

Depends on `core`, `styles`, `icons`, `images`, `mux-video`, `richtext`, `site`, `zap` (plus `@base-ui-components/react`, `dayjs`, `next-themes`, `traverse`). Optional peer integrations with `@mux/blurup`, `@pro-laico/tracking`, `unocss`, and `zustand`.

This is the integration layer — read `core`, `zap`, and `styles` first if you're new to the repo.
