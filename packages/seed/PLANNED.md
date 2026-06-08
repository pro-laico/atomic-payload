# @pro-laico/seed — Planned Features & Deferred Work

Forward-looking backlog distilled from `AUDIT.md`. These items are intentionally **not** done today — each is a larger typing pass or a minor additive API. The corresponding `AUDIT.md` checkbox stays `[ ]` with an inline annotation.

## Type safety

### `as any` / `as unknown as` typing pass
- **What:** Remove the `children as any` casts in the seed data builders and the `as unknown as Icon[]` / `as unknown as Page` casts in `seed/index.ts`, conforming the literal block/page seed data to the generated `ChildBlocks`/`Page`/`Icon` types (or a genuinely-validating guard).
- **Why deferred:** Needs a real typing pass, not a drive-by — high-churn against large literal seed data, easy to introduce mismatches. Better as a focused task than mixed into the audit sweep.
- **Source:** `src/seed/footer.ts:360`, `src/seed/pages/home.ts:765`, `src/seed/pages/notFoundPage.ts:240`, `src/seed/index.ts:98,104-110` · AUDIT.md → Medium.

## API ergonomics

### Expose `slugConfig` through the plugin / `SeedFn`
- **What:** Thread `slugConfig` through a `SeedPluginOptions` field (or widen the `SeedFn` type) so consumers wrapping the bundled `seed` via the plugin option can pass a custom `slugConfig`.
- **Why deferred:** Small additive enhancement; no consumer needs a custom `slugConfig` today, and the bundled `seed` can still be imported directly. Left for a concrete need.
- **Source:** `src/endpoint.ts:3` · AUDIT.md → Low.

### `SeedButton` subpath export
- **What:** Add a `./admin/seedButton` export if external use of the button (outside the `BeforeDashboard` wrapper) is ever wanted.
- **Why deferred:** Currently internal to `BeforeDashboard`; adding a subpath commits to a public surface. Revisit if a consumer asks.
- **Source:** `package.json` exports · AUDIT.md → Medium.

## Notes / intentional-for-now

- **External-publish build** — `main`/`types`/`exports` resolve to raw `src` (the standard workspace `transpilePackages` pattern); the no-op `build` is expected. For a hypothetical non-bundler npm consumer, add a real `dist` build or document the source-only contract + CI guard. (AUDIT.md → Medium.)
