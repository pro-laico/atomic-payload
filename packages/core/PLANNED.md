# @pro-laico/core — Planned Features & Deferred Work

Forward-looking backlog distilled from `AUDIT.md`. These items are intentionally **not** done today — each needs a careful tested refactor, a feature decision, or is part of the cross-package cleanup. The corresponding `AUDIT.md` checkbox stays `[ ]` with an inline annotation.

## Cache-tag integrity

### Extract a shared `buildTags(tag, tid, draft)` helper
- **What:** Unify the tag-string construction used by both `revalidateTag` and `createGetCached` so the revalidate-side and get-side tag strings can't drift (they must match exactly or revalidation silently misses).
- **Why deferred:** Rewrites tag construction on both sides at once — a subtle mismatch would silently break cache invalidation. Worth doing deliberately with verification, not a drive-by. Current behavior appears correct; this hardens against future drift.
- **Source:** `src/utilities/revalidateTag.ts:45-51`, `src/utilities/cache/getCached.ts:43-52` · AUDIT.md → Medium.

## Unfinished features

### `getCachedAtomicActions` — finish or delete
- **What:** The getter ships a large commented-out action-aggregation body and returns only `{ version }`, while the registry/types advertise `AtomicStoreInitialState`. Either delete the dead block or finish the implementation (and update the `dependencyTags` note referencing `settings`).
- **Why deferred:** Reads as an unfinished feature, not obviously dead code — depends on whether atomic-actions caching is still planned. Needs intent before deleting a half-built feature.
- **Source:** `src/utilities/cache/getAtomicActions.ts:19-45` · AUDIT.md → Low.

## Build / CI hardening

### Dist-staleness CI guard
- **What:** Add a CI check that the committed `dist/` is not stale vs `src/` (or move `.`/`main`/`types` to `dist` too so the whole surface builds from one place). `prepack` chains `clean && build`, but nothing guarantees a fresh `dist` is committed.
- **Why deferred:** The immediate staleness was fixed by a clean rebuild; the guard prevents recurrence. The stale-`dist`-masking-a-`'use server'`-bug episode (see workspace conventions) is exactly what this prevents.
- **Source:** `package.json` exports + `dist/` · AUDIT.md → Critical #1 follow-up.

## Cross-package: circular workspace deps (remaining)

- **What:** Core's own half is **done** — `sanitizeData`/`manualLogger` moved into core, the five sibling deps reclassified from `dependencies` → optional `peerDependencies` + `devDependencies`, and `dist` verified free of `@pro-laico/*` runtime imports. The remaining `styles ↔ site` `ShortcutSet` type cycle is the same pattern and is tracked in `styles/PLANNED.md` / `site/PLANNED.md` (move shared stubs to a leaf package).
- **Source:** `package.json` deps · AUDIT.md → Critical #2.

## Notes / intentional-for-now

- **`slugField` default uniqueness** — sets `index: true` but not `unique`. Already supports `slugOverrides: { unique: true }`; the index-only default is intentional (nested-docs/multi-tenant slugs aren't globally unique — uniqueness is enforced on `href`). No change unless the data model changes. (AUDIT.md → Low.)
- **Access predicates home** — access predicates deliberately live in the consuming packages (`site`/`styles`/`fonts`/`tracking`), not core; core ships only `getMeUser`. The brief listing an `access/` dir in core is stale. (AUDIT.md → Low.)
