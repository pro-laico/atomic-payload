# @pro-laico/images — Planned Features & Deferred Work

Forward-looking backlog distilled from `AUDIT.md`. These items are intentionally **not** done today — external-publish readiness or a core-side optimization. The corresponding `AUDIT.md` checkbox stays `[ ]` with an inline annotation.

## External-publish readiness

### Build blocks to `dist` and point exports there
- **What:** For an external (non-bundler) npm consumer, compile `src/blocks/**` (currently excluded in `tsconfig.build.json`) and add `import`/`require`/`types` conditions pointing at `dist/` to the `.`, `./schema`, and `./blocks/imageChild*` exports (currently raw `.ts`/`.tsx`).
- **Why deferred:** Intentional source-only consumption today — every export resolves to `src`, the same decision applied across `@pro-laico/*`. The committed `dist` exists only for a hypothetical npm publish and is rebuilt clean.
- **Source:** `package.json:10-32`, `tsconfig.build.json:11` · AUDIT.md → Critical #2 / High (annotated intentional).

## Upstream (core) optimization

### `getCachedImage` over-fetch
- **What:** `getCachedImage` in core does a `findByID` with no `depth: 0` or `select` clause — it fetches the full document just to extract a URL.
- **Why deferred:** Lives in `@pro-laico/core`, not this package; noted here because `images` consumes it. Track the fix on the core side.
- **Source:** core `getCachedImage` · AUDIT.md → Notes.

## Notes / intentional-for-now

- The `dist/` tree is a build artifact — never hand-edit. Rebuilding from reconciled source resolves all dist-specific findings (the stale `@pro-laico/ap-utils`/`ap-apf` imports were already cleared by a clean rebuild).
- Search other packages' `dist/` trees for the same stale `ap-utils`/`ap-apf` references before the next publish.
