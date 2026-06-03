# @pro-laico/mux-video — Payload Plugin Audit

## Summary

The plugin is a thin wrapper around `@oversightstudio/mux-video` that composes cleanly and keeps the surface area small. The most significant issues are packaging problems: the `exports` map and `main`/`types` fields point at raw TypeScript source instead of compiled `dist/`, the TSX component is excluded from the build entirely, and the `exports` map exposes a stale `./src` subpath. A few medium-priority concerns exist around shallow `collectionOverride` merging (arrays silently replaced), missing `defaultValue` on the `preload` field, the component passing `@mux/mux-video-react` props without type guards, and the async-plugin guard throwing instead of awaiting.

---

> **Status:** Code-correctness items fixed — `collectionOverride` now deep-merges (access/admin/fields/hooks), and every field has the `defaultValue`/`required`/`index` its description promised. The `main`/`types`/`exports`→`src` and blocks-build-exclusion items are the intentional workspace-only pattern (all exports resolve to `src`; the committed `dist` is vestigial and clean of stale imports), so they're left as-is. The redundant `./src` alias key (a pure duplicate of `.`) was removed.

## Findings

### 🟠 High

- [ ] **`main`/`types`/`exports` point at source, not dist** — _Intentional: workspace-only source consumption (all exports resolve to `src`)._ — `package.json:10-28` — All three entry points (`"main"`, `"types"`, and every key in `"exports"`) resolve to `./src/…ts` / `./src/…tsx`. Published consumers who don't run the monorepo TypeScript pipeline will receive raw TS and fail. **Fix:** Change `"main"` → `"./dist/index.js"`, `"types"` → `"./dist/index.d.ts"`, and update every `"exports"` entry to use `dist/` equivalents with proper `"import"`/`"require"`/`"types"` conditions.

- [ ] **Block `.tsx` files are excluded from the build** — `tsconfig.build.json:12-13` — `"exclude": ["dist", "node_modules", "src/blocks/**"]` means the `videoChild` block and component are never compiled. The `"exports"` map for `./blocks/videoChild` and `./blocks/videoChild/component` therefore reference files that don't exist in `dist/`. **Fix:** Remove `"src/blocks/**"` from the `exclude` list; also add `"src/**/*.tsx"` to the `"include"` list so the component is compiled. Ensure JSX is emitted correctly (`"jsx": "react-jsx"` is set in the base config but missing in `tsconfig.build.json` — add it there too, or remove the override that drops it).

- [x] **Stale `./src` export subpath** — _Fixed: removed the redundant `"./src"` exports key (duplicate of `.`, no consumer referenced it). The other exports intentionally still resolve to `src`._ — `package.json:17-20` — The `"./src"` key in `exports` duplicates the root `.` and exposes an internal source path as a public API contract. Any consumer importing `@pro-laico/mux-video/src` will be broken once source files move to dist. **Fix:** Remove the `"./src"` export entry entirely.

- [x] **`collectionOverride` shallow-merges arrays, silently replacing them** — _Fixed: `access`/`admin` deep-merged, `fields` appended, `hooks` merged via core's `mergeHooks`._ — `src/plugin.ts:36` — `{ ...MuxVideo, ...collectionOverride }` means if `collectionOverride` contains e.g. `hooks`, `access`, or `fields`, those arrays replace rather than append. The option name "override" is slightly misleading but the doc says "shallow merge" — the deeper risk is that `access` is silently overwritten with a partial object. **Fix:** Either deep-merge specific sub-keys (`access`, `hooks`, `fields`, `admin`) explicitly before spreading, or add a JSDoc warning that access/hooks arrays are replaced wholesale, and validate that a passed `access` is complete.

### 🟡 Medium

- [ ] **Async-plugin guard throws instead of awaiting** — `src/plugin.ts:47-49` — If a future version of `@oversightstudio/mux-video` returns a `Promise<Config>`, the plugin throws a hard error at config-build time with no recovery path. This kills the entire Payload startup. The guard itself is correct in principle, but the error message says "pin to a sync version" with no way for the caller to fix it at runtime. **Fix:** If the goal is to support async in the future, change the function signature to `async` and `await` the result; if sync-only is intentional, keep the throw but surface a clearer actionable message (version of upstream that is known-good).

- [x] **`preload` field has no `defaultValue`** — _Fixed: `required: true` + `defaultValue: 'metadata'`._ — `src/blocks/videoChild/block.ts:51` — The description says "Default is metadata" but no `defaultValue: 'metadata'` is set on the field. The stored value will be `null`/`undefined` when an editor doesn't touch it, causing the renderer to omit the attribute entirely (browser default varies). **Fix:** Add `defaultValue: 'metadata'` to the `preload` select field.

- [x] **`time`, `blur`, `quality` fields have no `defaultValue` matching their descriptions** — _Fixed: `defaultValue` `0`/`20`/`1`._ — `src/blocks/videoChild/block.ts:62-63` — The descriptions claim defaults of `0`, `20`, and `1` respectively, but no `defaultValue` is declared. Saved documents will have `null` for these fields, diverging from what the description claims and potentially causing the render component to pass `undefined` props to `@mux/mux-video-react`. **Fix:** Add `defaultValue: 0` on `time`, `defaultValue: 20` on `blur`, `defaultValue: 1` on `quality`.

- [ ] **`VideoChild` component passes props without type safety** — `src/blocks/videoChild/component.tsx:10` — `{...pt?.c?.p}` and `{...pt?.c?.da}` are spread directly onto `<MuxVideoReact />` with no type check. If `pt`, `pt.c`, `pt.c.p`, or `pt.c.da` are shaped differently at runtime, invalid props silently pass through. The `RenderChild<VideoChildType>` type depends entirely on `@pro-laico/atomic/children/schema` being correct. **Fix:** Destructure the actual video props from the `pt` object with explicit types, or validate the shape before spreading.

- [x] **`muted` checkbox has no `defaultValue: false`** — _Fixed: `defaultValue: false` on `autoplay`/`loop`/`muted`/`disableBlur`._ — `src/blocks/videoChild/block.ts:53` — Payload checkboxes default to `null` when unchecked, not `false`. The description says "Default is false" but nothing enforces it. When the value is `null`, the Mux React component receives `muted={null}` which may coerce to `true` in some browser implementations. **Fix:** Add `defaultValue: false` to all four checkbox fields (`autoplay`, `loop`, `muted`, `disableBlur`).

- [x] **README documents a non-existent `types/` directory** — _Fixed: removed the `types/` row from the "What lives in `src/`" table._ — `README.md:53` — The "What lives in `src/`" table lists `types/` as "Type augmentations" but that directory does not exist in the repo. **Fix:** Remove that row from the table, or create the directory if type augmentations are planned.

### 🟢 Low / nice-to-have

- [ ] **`@mux/mux-video-react` is a runtime `dependency` but the Mux SDK is not** — `package.json:42-45` — `@mux/mux-video-react` (the React player) is in `dependencies`, which is correct for the component. However, there is no direct Mux Data SDK dependency (e.g. `@mux/mux-node`) — that lives entirely inside `@oversightstudio/mux-video`. This is intentional but worth noting: if the upstream peer is removed, there is no fallback. No change needed unless the upstream peer is dropped.

- [ ] **`index.ts` does not re-export `createVideoBlock` or `Video`** — `src/index.ts:1-3` — The named exports from `src/blocks/videoChild/block.ts` (`createVideoBlock`, `Video`, `VideoBlockOptions`) are only reachable via the `./blocks/videoChild` subpath export, not from the root `.`. This is a deliberate design choice but means consumers wanting the default block must use the subpath. Consider documenting this in the README.

- [ ] **`access.read: anyone`** — `src/collections/muxVideo.ts:9` — The collection read access is fully public (`() => true`). Any unauthenticated request can enumerate all Mux video metadata (playback IDs, asset IDs, etc.). This is likely intentional for front-end rendering, but Mux playback IDs are effectively unforgeable signed tokens — if the upstream plugin stores raw playback IDs or asset IDs on the collection document, public read exposes those identifiers. **Fix:** Confirm with the upstream plugin what fields are stored; if raw asset IDs are persisted, consider restricting read to authenticated users and using signed playback tokens only on the front end.

- [ ] **`initSettings` defaults read env vars at module import time** — `src/plugin.ts:29-32` — The `initSettings` default object is evaluated when the outer function is called (at `buildConfig` time). If env vars are loaded lazily (e.g. via `dotenv` after the config module is evaluated), credentials will be empty strings silently. **Fix:** Defer env reads inside the inner `(config) => Config` function body, or add a warning when `tokenId` or `tokenSecret` are empty strings at plugin initialization time.

- [x] **No `index` or `unique` on the `video` relationship field** — _Fixed: added `index: true`._ — `src/blocks/videoChild/block.ts:45` — The `video` relationship field to `mux-video` has `required: true` but no `index: true`. Queries filtering by this relationship (e.g. "find all blocks that use video X") will be full-collection scans. **Fix:** Add `index: true` if the consumer app is expected to query by video relationship.

- [x] **`preload` select field has no `required: true`** — _Fixed: added `required: true` + `defaultValue: 'metadata'`._ — `src/blocks/videoChild/block.ts:51` — Without `required`, an editor can save a block with no preload value, resulting in `null` being stored (distinct from `'metadata'`). Combined with the missing `defaultValue`, the field is effectively always nullable. **Fix:** Add `required: true` and `defaultValue: 'metadata'`.

---

## Notes

- The plugin architecture itself is correct: `(options) => (config) => Config`, `enabled` guard returns early, config is spread before passing to upstream, and the upstream result is returned directly. The composition pattern is sound.
- The `collectionOverride` shallow-merge limitation is documented ("shallow override"), which reduces the severity, but the word "override" in a Payload plugin context typically means "applied last with deep merge." Consider renaming to `collectionShallowMerge` or expanding to a deep merge.
- There are no hooks in this package's own code — all hooks, Mux API calls, and webhook handling are delegated to `@oversightstudio/mux-video`. This means hook quality, webhook signature verification, and Mux API error handling are entirely the upstream's responsibility and should be audited there separately.
- The `dist/` directory exists and contains compiled output for the non-block files, confirming the build runs. The block exclusion from the build is therefore an active bug, not just a config oversight.
