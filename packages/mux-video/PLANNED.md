# @pro-laico/mux-video — Planned Features & Deferred Work

Forward-looking backlog distilled from `AUDIT.md`. These items are intentionally **not** done today — external-publish readiness, upstream-dependent behavior, or low-priority hardening. The corresponding `AUDIT.md` checkbox stays `[ ]` with an inline annotation.

## External-publish readiness

### Build blocks to `dist` and point exports there
- **What:** For an external (non-bundler) npm consumer, compile `src/blocks/**` (currently excluded in `tsconfig.build.json`; also add `src/**/*.tsx` to `include` and ensure `jsx: "react-jsx"` is set in `tsconfig.build.json`) and point `main`/`types`/`exports` at `dist/` with proper `import`/`require`/`types` conditions.
- **Why deferred:** Intentional source-only consumption today — all exports resolve to `src`, the standard workspace pattern; the committed `dist` is vestigial and clean of stale imports.
- **Source:** `package.json:10-28`, `tsconfig.build.json:12-13` · AUDIT.md → High (annotated intentional).

## Upstream-dependent

### Async-plugin support
- **What:** If a future `@oversightstudio/mux-video` returns `Promise<Config>`, the current guard throws a hard error at config-build time (kills Payload startup). If async support becomes a goal, make the function `async` and `await` the upstream result; otherwise keep the throw but surface a clearer actionable message (known-good upstream version).
- **Source:** `src/plugin.ts:47-49` · AUDIT.md → Medium.

### `VideoChild` prop type-safety
- **What:** `{...pt?.c?.p}` / `{...pt?.c?.da}` are spread onto `<MuxVideoReact />` with no type check; correctness depends entirely on `@pro-laico/atomic/children/schema`. Destructure the actual video props with explicit types, or validate the shape before spreading.
- **Source:** `src/blocks/videoChild/component.tsx:10` · AUDIT.md → Medium.

### Public read access review
- **What:** `muxVideo` collection has `access.read: anyone` (`() => true`). If the upstream plugin persists raw asset/playback IDs on the document, public read exposes them. Confirm with upstream what fields are stored; restrict read to authenticated + use signed playback tokens if needed.
- **Source:** `src/collections/muxVideo.ts:9` · AUDIT.md → Low.
