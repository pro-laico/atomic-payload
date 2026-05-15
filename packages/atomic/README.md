# @pro-laico/atomic

The Atomic Payload runtime. Combines what used to ship as four separate packages:

- **`@pro-laico/ap-actions`** → `@pro-laico/atomic/actions` — action blocks (theme, form, cookieConsent, dynamicStore, portal), shared field builders, and the action block storage processor.
- **`@pro-laico/ap-atomic-hook`** → `@pro-laico/atomic/hook` — the `beforeChange` orchestration hook, CSS / UnoCSS processor, design-set pipeline, and the zustand-based client `AtomicStore`.
- **`@pro-laico/ap-forms`** → `@pro-laico/atomic/forms` — form & input submission pipelines (rate limiting, sanitation, validation), the server submit action, and `formProcessor`.
- **`@pro-laico/children`** → `@pro-laico/atomic/children` — child block plugin (AtomicChild + SimpleText built-in, others contributed by sibling packages), render component, admin row labels, shared field utilities (`TrackingTab`, `ColoredEnd`, `TagTypeField`, `ChildsSettingsTab`).

## Plugin surface

Each of the four namespaces exports its plugin factory unchanged:

```ts
import { actionsPlugin } from '@pro-laico/atomic/actions'
import { atomicHookPlugin } from '@pro-laico/atomic/hook'
import { formsPlugin } from '@pro-laico/atomic/forms'
import { childBlocksPlugin } from '@pro-laico/atomic/children'
```

(or import all four from the package root, which re-exports them).

## Subpath imports

All previously-published subpaths are preserved 1:1 under the new namespace. Mechanical migration:

| Old | New |
| --- | --- |
| `@pro-laico/ap-actions/schema` | `@pro-laico/atomic/actions/schema` |
| `@pro-laico/ap-atomic-hook/light` | `@pro-laico/atomic/hook/light` |
| `@pro-laico/ap-atomic-hook/client` | `@pro-laico/atomic/hook/client` |
| `@pro-laico/ap-forms/submitForm/serverFunction` | `@pro-laico/atomic/forms/submitForm/serverFunction` |
| `@pro-laico/children/render` | `@pro-laico/atomic/children/render` |
| `@pro-laico/children/admin/coloredEnd` | `@pro-laico/atomic/children/admin/coloredEnd` |

…and so on. See this package's `exports` map for the full list.
