# `@pro-laico/tracking` — Public Export Surface Audit

> Audit-only. No source was edited and no typechecks were run.

Barrel: 5 → keep 2, remove 3. Subpaths: 4 → keep 4, remove 0.

## Scope of the audit

**Root barrel** (`src/index.ts`) exports:

1. `googleTagManagerGroup` (field-group factory)
2. `postHogGroup` (field-group factory)
3. `Tracking` (the `tracking` global config)
4. `TrackingPluginOptions` (type)
5. `default` / `trackingPlugin` (the plugin factory — same value, two names)

**Subpaths** (`package.json` `exports` + `publishConfig.exports`):

- `.` — the root barrel above
- `./schema` — `src/types/payload-augment.ts` → `Tracking` type-augmentation stub
- `./cache` — `src/cache/index.ts` → `getCachedTracking`
- `./provider` — `src/components/frontend/index.ts` → `PostHogProvider`, `GoogleTagManagerProvider`, `VercelProvider`, `TrackingProvider`

"External consumer" = an import in `templates/**`, `examples/**`, or another `packages/*/src/**`. Excluded per the brief: anything under `packages/tracking/src`, `dist/**`, `*payload-types*` (generated), and `.md`/`.mdx` docs. No `templates/**/admin/importMap.js` or `examples/**/admin/importMap.js` references any tracking subpath (verified — tracking ships no admin-importMap UI component), so there are no runtime-importMap subpaths to protect here.

---

## Keep

### Barrel

- **`default` / `trackingPlugin`** — the plugin factory and main entry point. External consumer: `templates/atomic-payload/src/plugins/index.ts:6` (`import { trackingPlugin } from '@pro-laico/tracking'`, used at line 54). KEEP (plugin + default export).
- **`TrackingPluginOptions`** — the main options type for the plugin. Not imported by name in any external `.ts`/`.tsx` (only referenced in docs), but it is the options type of the kept plugin/default export, so it is part of the public API. KEEP (main options type).

### Subpaths

- **`.`** (root barrel) — entry for `trackingPlugin`. External consumer: `templates/atomic-payload/src/plugins/index.ts:6`. KEEP.
- **`./schema`** — the Payload `Tracking` type-augmentation stub (`export type Tracking = Get<'Tracking', DefaultRecord>`). This is the type-augmentation entry that resolves through `@pro-laico/core`'s `PayloadAugment` (populated by the generated `templates/atomic-payload/src/payload-types.augment.d.ts:21` `Tracking: G.Tracking`). External consumers (the tracking provider components import it via the package specifier, not a relative path): `packages/tracking/src/components/frontend/TrackingProvider.tsx:2`, `PostHogProvider.tsx:8`, `GoogleTagManagerProvider.tsx:5`. KEEP (schema / payload-augment entry). Note: I did not find `@pro-laico/core` itself importing `tracking/schema` — the task hint "core imports tracking/schema" does not hold for the current tree; the augmentation flows the other way (tracking augments core's `PayloadAugment`). It stays regardless, as the augmentation entry.
- **`./cache`** — `getCachedTracking`. External consumer: `templates/atomic-payload/src/app/(frontend)/layout.tsx:7` (`import { getCachedTracking } from '@pro-laico/tracking/cache'`, used at line 30). KEEP (cache getter used externally).
- **`./provider`** — the frontend component barrel an app imports. External consumer: `templates/atomic-payload/src/app/(frontend)/layout.tsx:9` (`import { TrackingProvider } from '@pro-laico/tracking/provider'`, used at lines 41/49). KEEP (provider subpath an app imports). See Judgment calls about which *symbols* in this barrel are actually consumed.

---

## Remove (internal-only)

These barrel exports have **no external consumer**. They are used only via relative imports inside `packages/tracking/src`, so dropping them from `src/index.ts` does not delete the module or break anything internal.

- **`Tracking`** (the global, `src/index.ts:3`) — no external `import { Tracking } from '@pro-laico/tracking'` exists in `templates/**`, `examples/**`, or any other `packages/*/src/**`. The name `Tracking` appears externally only in generated `templates/atomic-payload/src/payload-types.ts` (a generated interface, excluded) and in `payload-types.augment.d.ts` (generated, references `G.Tracking`, not this export). The global is registered for users by `trackingPlugin` itself, and is consumed internally only by `src/plugin.ts:3` (relative `./globals/tracking`). REMOVE (internal-only). Evidence: broad repo grep for an external `{ Tracking }` import from `@pro-laico/tracking` → no matches. (Note: the *type* `Tracking` from `./schema` is a different, kept export.)
- **`postHogGroup`** (`src/index.ts:2`) — no external consumer. Used internally only by `src/globals/tracking.ts:4` (relative `./postHogGroup`). REMOVE (internal-only). Evidence: no external import of `postHogGroup`; the only mentions outside `packages/tracking/src` are in `docs/**/*.mdx` (excluded).
- **`googleTagManagerGroup`** (`src/index.ts:1`) — no external consumer. Used internally only by `src/globals/tracking.ts:6` (relative `./gtmGroup`). REMOVE (internal-only). Evidence: no external import of `googleTagManagerGroup`; only docs mention it.

## Remove (redundant subpath)

None. All four subpaths (`.`, `./schema`, `./cache`, `./provider`) are distinct and at least one is imported by external code; none merely duplicates the root barrel.

---

## Judgment calls

- **`Tracking` global, `postHogGroup`, `googleTagManagerGroup`** (listed under Remove above) are arguably an intentional "compose your own Tracking global" escape hatch — the docs (`docs/content/docs/concepts/architecture.mdx:40`, `docs/content/docs/plugins/tracking.mdx`) explicitly advertise `postHogGroup()` / `googleTagManagerGroup()` and importing `Tracking` to extend it. They have zero real code consumers today.
  - Recommendation: **REMOVE** to match actual usage and shrink the surface — but only if the docs are updated in the same change, since the docs currently promise these as public API. If you want to keep the advertised escape hatch without code proof, reclassify all three as KEEP. My default recommendation is remove-and-update-docs, because the brief targets exports nothing outside the package uses.

- **`PostHogProvider`, `GoogleTagManagerProvider`, `VercelProvider`** (the three individual providers in the `./provider` barrel, `src/components/frontend/index.ts:2-4`) — the `./provider` subpath stays (it ships the composite `TrackingProvider`, which is the only one an app imports — `templates/atomic-payload/src/app/(frontend)/layout.tsx:9`). The three individual providers have **no external consumer**; they are used only internally by `TrackingProvider.tsx:5-7` via relative imports. Docs (`docs/content/docs/plugins/tracking.mdx:176-178`) present them as "in case you wire providers individually" escape hatches.
  - Recommendation: **JUDGMENT** — they can be dropped from the `./provider` barrel (re-exports only; `TrackingProvider` keeps importing them relatively) to trim the surface, but they are a plausibly-public per-provider escape hatch that the docs advertise. Lean keep if you value the documented individual-provider API; lean remove (and update docs) if you want the barrel to expose only `TrackingProvider`.

- **`TrackingPluginOptions`** — kept above as the main options type, but note it has no direct external import by name (only docs reference it). It is standard practice to keep a plugin's options type public, so KEEP stands; flagging only for transparency.
