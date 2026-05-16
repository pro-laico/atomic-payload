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

The four plugin factories register independently:

```ts
import { buildConfig } from 'payload'
import { actionsPlugin } from '@pro-laico/atomic/actions'
import { atomicHookPlugin } from '@pro-laico/atomic/hook'
import { formsPlugin } from '@pro-laico/atomic/forms'
import { childBlocksPlugin } from '@pro-laico/atomic/children'

export default buildConfig({
  plugins: [
    actionsPlugin(),
    atomicHookPlugin({ /* getCached, livePreviewUrl, etc */ }),
    formsPlugin(),
    childBlocksPlugin(),
  ],
})
```

You can also import all four from the package root — the root barrel re-exports the plugin factories and a curated set of value/type exports. For everything else, prefer the namespaced subpaths.

## What each namespace contains

### `/actions`

The set of "action blocks" Payload users can attach to interactive elements. Built-ins: theme toggle, form submit, cookie consent, dynamicStore, portal. Action blocks are stored as data on a block and executed on the client when their trigger fires.

- `ActionBlockStorageProcessor` — runs at beforeChange to normalize action data.
- `ActionFilters` — predicates for filtering which action blocks apply.
- `AllActionBlocks` — the registered set, contributed via plugin options.

### `/hook`

The brain. `atomicHookPlugin` registers a Payload `beforeChange` hook (via `createAtomicHook`) that:

1. Walks the document looking for class names and design-token references.
2. Runs the CSS / UnoCSS processor (`createCssProcessor`) against the active design set.
3. Persists generated CSS to the right storage global (draft/published).
4. Hydrates the front-end zustand store (`AtomicStore`) so client components see the same state.

Sub-exports worth knowing:
- `@pro-laico/atomic/hook/light` — minimal client-safe API for components that just need to read state.
- `@pro-laico/atomic/hook/client` — the zustand store binding for React.

### `/forms`

End-to-end form processing. A `submit-form` action block + corresponding `input/*` child blocks plug into a server function (`@pro-laico/atomic/forms/submitForm/serverFunction`) that runs sanitation, validation, and rate limiting through SVR (Sanitation/Validation/Rate-limiting) blocks before invoking `formProcessor`.

Extending forms means adding a new SVR block — the architecture is intentionally block-based so the dashboard stays the source of truth.

### `/children`

The recursive content model. `childBlocksPlugin` registers the `AtomicChild` block and the built-in `SimpleText` block, then exposes a hook (`useActions`) that wires children to the action system. Sibling packages contribute their own child blocks (e.g. `@pro-laico/images/blocks/imageChild`, `@pro-laico/icons/blocks/iconChild`) which get picked up automatically when those plugins are installed.

The `render` subpath provides the front-end React component that walks the tree and renders each child.

## Notable subpaths

The full list is in `package.json` `exports`. Common ones:

| Subpath | What's there |
| --- | --- |
| `./actions/schema` | `payload-augment` types for action blocks |
| `./actions/blocks` | Block factories |
| `./actions/fields/strict/registry/*` | Strict typed registry entries (theme, cookieConsent) |
| `./hook/light` | Client-safe slice of the hook API |
| `./hook/client` | Zustand `AtomicStore` binding |
| `./forms/submitForm/serverFunction` | The server action that runs form submission |
| `./forms/submitForm/formProcessor` | The processor invoked after SVR passes |
| `./children/render` | Front-end renderer for child blocks |
| `./children/admin/*` | Admin row labels and select widgets |
| `./children/fields/*` | Reusable field configs (`trackingTab`, `coloredEnd`, `tagType`, `settings` tab) |

## Where it sits in the monorepo

Depends on `core`, `design-sets`, `icons`, `images`, `mux-video`, `richtext`, `site`, `zap`. Optional peer integrations with `@mux/blurup`, `@pro-laico/tracking`, `unocss`, and `zustand`.

This is the integration layer — read `core`, `zap`, and `design-sets` first if you're new to the repo.
