# @pro-laico/core — Planned Features & Deferred Work

Forward-looking backlog distilled from `AUDIT.md`. These items are intentionally **not** done today — each needs a careful tested refactor, a feature decision, or is part of the cross-package cleanup. The corresponding `AUDIT.md` checkbox stays `[ ]` with an inline annotation.

## Cache-tag integrity

### Share tag-string construction between `withCache` and `revalidateTag`
- **What:** The get-side tag construction is now centralized in `withCache` (it derives the `unstable_cache` key + dependency tags from a tag, id, and draft flag). The remaining work is sharing that derivation with `revalidateTag` so the revalidate-side and get-side tag strings can't drift (they must match exactly or revalidation silently misses).
- **Why deferred:** Rewriting tag construction on both sides at once is risky; a subtle mismatch would silently break cache invalidation. Worth doing deliberately with verification, not a drive-by. Current behavior appears correct; this hardens against future drift.
- **Source:** `src/utilities/revalidateTag.ts:45-51`, `src/utilities/cache/withCache.ts` · AUDIT.md → Medium.

## Unfinished features

### `getCachedAtomicActions` — finish or accept version-only
- **What:** The getter moved to `@pro-laico/atomic/cache` in the cache-getter relocation; the large commented-out action-aggregation body was dropped in the move, so it now returns only `{ version }` while its type advertises `AtomicStoreInitialState`. Either finish the action aggregation or accept the version-only shape (and update the `settings`-tag note).
- **Why deferred:** Reads as an unfinished feature, not obviously dead code; depends on whether atomic-actions caching is still planned. Needs intent before extending or trimming a half-built feature. Now an `@pro-laico/atomic` concern, not core's.
- **Source:** `packages/atomic/src/cache/index.ts` (`getCachedAtomicActions`) · AUDIT.md → Low.

## Build / CI hardening

### Dist-staleness CI guard
- **What:** Add a CI check that the committed `dist/` is not stale vs `src/` (or move `.`/`main`/`types` to `dist` too so the whole surface builds from one place). `prepack` chains `clean && build`, but nothing guarantees a fresh `dist` is committed.
- **Why deferred:** The immediate staleness was fixed by a clean rebuild; the guard prevents recurrence. The stale-`dist`-masking-a-`'use server'`-bug episode (see workspace conventions) is exactly what this prevents.
- **Source:** `package.json` exports + `dist/` · AUDIT.md → Critical #1 follow-up.

## Cross-package: circular workspace deps (remaining)

- **What:** Core's own half is **done** and now complete: `sanitizeData`/`manualLogger` moved into core, and after the cache-getter relocation (the data getters left core for the packages that own their collections) core's source imports zero `@pro-laico/*` leaf packages, so the optional `peerDependencies` on the five siblings were dropped entirely. The remaining `styles → site` `ShortcutSet` type import is the same pattern and is tracked in `styles/PLANNED.md` / `site/PLANNED.md` (move shared stubs to a leaf package).
- **Source:** `package.json` deps · AUDIT.md → Critical #2.

## Notes / intentional-for-now

- **`slugField` default uniqueness** — sets `index: true` but not `unique`. Already supports `slugOverrides: { unique: true }`; the index-only default is intentional (nested-docs/multi-tenant slugs aren't globally unique — uniqueness is enforced on `href`). No change unless the data model changes. (AUDIT.md → Low.)
- **Access predicates home** — access predicates deliberately live in the consuming packages (`site`/`styles`/`fonts`/`tracking`), not core; core ships only `getMeUser`. The brief listing an `access/` dir in core is stale. (AUDIT.md → Low.)

## Inline code TODOs

Captured from `TODO:` comments in source.

- **Convert the Toaster action to an atomic button variant** — `src/components/frontend/Toaster.tsx:19`.
- **Replace the hard-coded Toaster icon with a stored icon** — `src/components/frontend/Toaster.tsx:35`.
