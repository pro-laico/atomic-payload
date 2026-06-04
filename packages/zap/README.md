# @pro-laico/zap

> Zod with Atomic Payload extensions. A registry-aware schema layer shared across every `@pro-laico/*` package and the starter template.

## What this package is

`zap` is the schema vocabulary for Atomic Payload. It re-exports Zod and bolts on a tiny class (`z.ap`) that lets every package register its own Zod schemas into a single global registry keyed by string ID. That registry is the bridge between:

- **Zod schemas** authored inside packages (e.g. `ActionBlockType` in `@pro-laico/atomic/actions`)
- **TypeScript types** consumed by other packages and your app (`z.ap.Type<'ActionBlock'>`)
- **JSON Schema output** that Payload's `typescript.schema` config feeds into the generated `payload-types.ts`

If you've ever wondered how a block schema defined in one plugin ends up typed correctly when used by another, this is the wire.

## Why it exists

Atomic Payload is split into many independent plugin packages, but they share a lot of structural types: blocks, child blocks, action blocks, form input blocks, design tokens, etc. Hard-coding cross-package types creates tight coupling; passing them around at runtime is wasteful. `zap` solves both by giving every package a place to publish its schemas under a known ID, and giving consumers a typed lookup helper.

## Quick start

```ts
import { z } from '@pro-laico/zap'

// Register a schema
export const MySlug = z.ap.add(z.enum(['a', 'b']), { id: 'MySlug' })

// Retrieve it elsewhere
const slug = z.ap.get('MySlug')

// Use the type alias
const value: z.ap.Type<'MySlug'> = 'a'
```

## The `AtomicRegistry` type

The TypeScript side of the registry lives in `@pro-laico/zap/schema` as the type alias `AtomicRegistry`. It is **not** an interface — it's a resolver that routes through the `@pro-laico/core` kernel:

```ts
// @pro-laico/zap/schema
import type { Get } from '@pro-laico/core'

export type AtomicRegistry = Get<'AtomicRegistry', Record<string, any>>
```

Because it's a `type` alias, you **cannot** declaration-merge it (interface merging does not apply to type aliases). `Get<'AtomicRegistry', …>` looks up the `AtomicRegistry` key on the single `PayloadAugment` interface declared in `@pro-laico/core`, falling back to `Record<string, any>` when no project has augmented it.

### How registration actually works

There is no hand-written interface to merge. Concrete types flow in through Payload's type generation:

1. **Register at runtime.** Each package calls `z.ap.add(schema, { id })` to publish a Zod schema into the global registry under a string ID.
2. **Emit JSON Schema.** `toJSONSchemaExtensions` (which calls `ap.toJSONSchema()`) aggregates every registered schema into a single `AtomicRegistry` definition and feeds it to Payload's `typescript.schema` option.
3. **Payload generates types.** Payload writes an `export interface AtomicRegistry { … }` into the project's `payload-types.ts`, with one member per registered ID.
4. **The kernel is augmented once.** The generated `payload-types.augment.d.ts` (produced by `pnpm generate:types`) augments the kernel — not `zap`:

   ```ts
   // src/payload-types.augment.d.ts (auto-generated — do not edit by hand)
   import type * as G from './payload-types'

   declare module '@pro-laico/core' {
     interface PayloadAugment {
       AtomicRegistry: G.AtomicRegistry
     }
   }
   ```

5. **Stubs resolve.** `zap`'s `AtomicRegistry = Get<'AtomicRegistry', …>` now resolves to the project's generated shape, so `z.ap.get(id)` and `z.ap.Type<id>` are concretely typed.

To register your own schema in an app, add it at runtime and re-run type generation — you do not (and cannot) declare-merge `AtomicRegistry`:

```ts
import { z } from '@pro-laico/zap'

// Register at runtime; the ID becomes a member of AtomicRegistry after `pnpm generate:types`.
export const MySlug = z.ap.add(z.enum(['a', 'b']), { id: 'MySlug' })
```

## What lives here

- `src/ap.ts` — the `AtomicPayloadZodClass` (`z.ap`) with `add`, `get`, `type`, and `toJSONSchema`.
- `src/jsonSchema.ts` — helpers that drive Payload's generated types from registered schemas.
- `src/types/payload-augment.ts` — the `AtomicRegistry` type alias that resolves through the `@pro-laico/core` kernel.

## Exports

Beyond the default `z` (Zod with `z.ap` attached), `index.ts` exposes:

- **`AtomicPayloadZodClass`** — the class behind `z.ap`. Exported for typing/extension; the shared singleton is `z.ap`, so you normally don't instantiate it yourself.
- **`toJSONSchemaExtensions`** — the Payload-integration helper. Spread it into your `typescript.schema` extension function to add every registered schema (via `ap.toJSONSchema()`) to the generated JSON schema's `definitions`:

  ```ts
  import { toJSONSchemaExtensions } from '@pro-laico/zap'

  // payload.config.ts
  typescript: {
    schema: [
      ({ jsonSchema }) => toJSONSchemaExtensions({ jsonSchema }),
    ],
  }
  ```

- **`generateBlocksType`** — builds a JSON-schema entry describing a `oneOf` union of block `$ref`s, for use alongside `toJSONSchemaExtensions` in a `typescript.schema` function:

  ```ts
  import { generateBlocksType } from '@pro-laico/zap'

  generateBlocksType({ name: 'MyBlocks', refs: ['HeroBlock', 'CtaBlock'] })
  ```

- **`GenerateBlocksTypeProps`** (type) — the argument shape for `generateBlocksType`: `{ name: string; refs: (string | undefined)[] }`.

## Gotchas

- **Pinned to `zod@4.1.11`.** There's a known regression on newer versions that breaks handling of registered schemas. Do not upgrade Zod here without verifying.
- **`server-only`.** `src/ap.ts` imports `server-only`. The registry is populated at config-resolution time on the server; do not import `z.ap` from client components.

## Subpath imports

| Subpath | What's there |
| --- | --- |
| `.` | The default barrel: `z` (Zod with `z.ap` attached, also the default export), `AtomicPayloadZodClass`, `toJSONSchemaExtensions`, `generateBlocksType`, and `GenerateBlocksTypeProps`. |
| `./schema` | The `AtomicRegistry` type alias (`Get<'AtomicRegistry', Record<string, any>>`), kept separate so packages can reference the registry type without pulling in the `server-only` runtime barrel. |

## Peer dependencies

None. `zap` ships its runtime dependencies directly — `zod` (pinned to `4.1.11`), `traverse`, `server-only`, and the workspace `@pro-laico/core` — so consumers don't declare any peers of their own.

## Where it sits in the monorepo

Foundational. Almost every package in this repo depends on `zap` to declare its schemas. See `MONOREPO.md` at the repo root for the dependency graph.
