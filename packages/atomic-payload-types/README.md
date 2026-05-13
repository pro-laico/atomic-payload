# @pro-laico/atomic-payload-types

Shared TypeScript types for [Atomic Payload](https://github.com/pro-laico/atomic-payload) projects.

The package is decoupled from any specific Payload CMS schema: it ships stub references for every generated name (`Page`, `Header`, `Footer`, `Config`, `ChildBlocks`, `ChildBlockType`, etc.) and the consumer fills them in via TypeScript module augmentation against their own `payload-types.ts`.

## Install

```bash
pnpm add @pro-laico/atomic-payload-types
```

Peer dependencies (only required for the parts of the type surface that reference them): `payload`, `next-themes`, `react`.

## Usage

1. Generate your `payload-types.ts` as you normally would (`payload generate:types`).
2. Create an augmentation file anywhere in your project's TS include path, for example `src/types/payload-types.augment.d.ts`:

```ts
import type * as G from './payload-types'

declare module '@pro-laico/atomic-payload-types' {
  interface PayloadAugment {
    Config: G.Config
    Page: G.Page
    Header: G.Header
    Footer: G.Footer
    Form: G.Form
    Tracking: G.Tracking
    DesignSet: G.DesignSet
    ImageChild: G.ImageChild
    ShortcutSet: G.ShortcutSet
    SiteMetaDatum: G.SiteMetaDatum
    FormSubmission: G.FormSubmission
    StoredAtomicForm: G.StoredAtomicForm

    ChildBlocks: G.ChildBlocks
    ActionBlocks: G.ActionBlocks
    Runners: G.Runners
    Attributers: G.Attributers
    Attributer: G.Attributer
    AllActions: G.AllActions
    FormRateLimitBlocks: G.FormRateLimitBlocks
    FormSanitationBlocks: G.FormSanitationBlocks
    FormValidationBlocks: G.FormValidationBlocks
    InputSanitationBlocks: G.InputSanitationBlocks
    InputValidationBlocks: G.InputValidationBlocks

    ChildBlockType: G.ChildBlockType
    ActionBlockType: G.ActionBlockType
    RunnerType: G.RunnerType
    AttributerType: G.AttributerType
    AtomicInputTypes: G.AtomicInputTypes
    AtomicButtonTypes: G.AtomicButtonTypes
    AtomicChildVariants: G.AtomicChildVariants
    AtomicButtonPortalTypes: G.AtomicButtonPortalTypes
    FormRateLimitBlockType: G.FormRateLimitBlockType
    FormSanitationBlockType: G.FormSanitationBlockType
    FormValidationBlockType: G.FormValidationBlockType
    InputValidationBlockType: G.InputValidationBlockType
    InputSanitationBlockType: G.InputSanitationBlockType
    CollectionThatUsesCSSProcessorSlug: G.CollectionThatUsesCSSProcessorSlug
    CollectionWithStoredAtomicClassesSlug: G.CollectionWithStoredAtomicClassesSlug
  }
}
```

3. Import types as usual:

```ts
import type { Page, Config, GetCached } from '@pro-laico/atomic-payload-types'
```

Without an augmentation, every reference falls back to `any` / `string` / `any[]` defaults — the package compiles, but you get no schema-derived narrowing.

## Why module augmentation?

The hand-written types in this package reference shapes that only exist after Payload generates types for a specific config. Augmentation lets one package serve any number of Payload projects without templating or generics.
