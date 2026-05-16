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

## The `AtomicRegistry` interface

The TypeScript side of the registry lives in `@pro-laico/zap/schema` as an interface called `AtomicRegistry`. Each package that registers a schema also augments this interface so `z.ap.get(id)` and `z.ap.Type<id>` resolve to concrete types in consumer code.

To register your own schema in an app, declare-merge the interface:

```ts
declare module '@pro-laico/zap/schema' {
  interface AtomicRegistry {
    MySlug: 'a' | 'b'
  }
}
```

## What lives here

- `src/ap.ts` — the `AtomicPayloadZodClass` (`z.ap`) with `add`, `get`, `type`, and `toJSONSchema`.
- `src/jsonSchema.ts` — helpers that drive Payload's generated types from registered schemas.
- `src/types/payload-augment.ts` — the `AtomicRegistry` interface other packages augment.

## Gotchas

- **Pinned to `zod@4.1.11`.** There's a known regression on newer versions that breaks handling of registered schemas. Do not upgrade Zod here without verifying.
- **`server-only`.** `src/ap.ts` imports `server-only`. The registry is populated at config-resolution time on the server; do not import `z.ap` from client components.

## Where it sits in the monorepo

Foundational. Almost every package in this repo depends on `zap` to declare its schemas. See `MONOREPO.md` at the repo root for the dependency graph.
