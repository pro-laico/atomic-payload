# @pro-laico/icons — Planned Features & Deferred Work

Forward-looking backlog distilled from `AUDIT.md`. These items are intentionally **not** done today — part of the cross-package deps decision or external-publish readiness. The corresponding `AUDIT.md` checkbox stays `[ ]` with an inline annotation.

## Cross-package: dependency shape

### `@pro-laico/atomic` dependency classification
- **What:** `package.json` lists `@pro-laico/atomic` in `dependencies`, while the JSDoc/README claim "no runtime dependency on `@pro-laico/atomic`." The block components (consumed via `src`) **do** import `@pro-laico/atomic/children` at runtime, so the *wording* is the stale part — but whether this should be `peerDependencies` is the same dependency-shape question as the core circular-deps family.
- **Approach:** Fold into the workspace-deps decision (move shared schema stubs to a leaf package; settle peer-vs-dep classification across siblings). Cheap immediate follow-up: correct the "no runtime dependency" wording in the JSDoc/README.
- **Source:** `package.json:71` · AUDIT.md → Low. See also `core/PLANNED.md`.

## External-publish readiness

### Build blocks to `dist` and point exports there
- **What:** For an external (non-bundler) npm consumer, compile `src/blocks/**` (currently excluded in `tsconfig.build.json`) and point the `.`, `./Icon`, and block subpath exports at `dist/` instead of raw `src`.
- **Why deferred:** Intentional source-only consumption today — `.`/`./Icon`/block subpaths → `src` is the standard `@pro-laico/*` `transpilePackages` pattern; only the admin components (`./admin/*`) need and already point at `dist`. Matters only for a hypothetical non-bundler npm consumer.
- **Source:** `package.json:12-20`, `tsconfig.build.json:12` · AUDIT.md → High (annotated intentional).

## Notes / intentional-for-now

- **`Icon` collection `read: authd`** — intentional: the frontend inlines icons via the cached `svgString` server-side, never the public `/api/icon/file` URL, so guests never need file read access (same posture as `@pro-laico/fonts`). (AUDIT.md → High, annotated intentional.)
- **`iconChild` icon field is `text`, not `upload`** — deliberate: stores the icon *name* resolved against the active IconSet at render, so no referential integrity and intentionally not `required`. Documented inline. (AUDIT.md → Medium.)
- **`iconSet` `maxPerDoc: 50`** — documented retention limit; with `schedulePublish` + `validate` every draft save makes a version, so busy sets silently drop history past 50. Trades audit depth against storage. (AUDIT.md → Low.)
