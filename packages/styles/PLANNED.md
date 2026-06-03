# @pro-laico/styles — Planned Features & Deferred Work

Forward-looking backlog distilled from `AUDIT.md`. These items are intentionally **not** done today — each needs a design decision or is part of the cross-package circular-deps cleanup. The corresponding `AUDIT.md` checkbox stays `[ ]` with an inline annotation.

## Design decisions pending

### `cssHook` change-gating
- **What:** Gate the standalone `cssHook`'s UnoCSS regeneration on whether a class/token field actually changed, instead of running the full `createGenerator` + `generate` pass on *every* `beforeChange` of any non-skip collection.
- **Why deferred:** It's a real perf win but changes *when* CSS regenerates. The canonical `atomicHook` already gates via `runAPF`/APF flags; mirroring that here is the fix, but the question is whether to do so or keep the standalone path always-regenerate for safety.
- **Source:** `src/hooks/cssHook.ts:74-91` · AUDIT.md → High.

### `mod` field intent
- **What:** Decide whether the `mod` checkbox on `defaultShortcuts` rows is vestigial or planned.
- **Context:** The processor composes UnoCSS shortcuts from `name`→`ClassName` only and ignores `mod`. It carries `apf: ['classes']` (feeds class extraction) and reads like a planned modifier-shortcut flag. Either honor it when composing UnoCSS shortcuts, or remove the field. Impact is nil today (`defaultShortcuts` defaults to `[]`).
- **Source:** `src/shortcutSet/tabs/shortcuts.ts:57` · AUDIT.md → Low.

## Cross-package: circular workspace deps

### Break the `styles ↔ site` `ShortcutSet` cycle
- **What:** Stop importing `@pro-laico/site/schema` for the `ShortcutSet` type while `site` depends on `styles`.
- **Approach:** Part of the broader workspace-deps decision — move the shared `ShortcutSet` type to a leaf package (`@pro-laico/zap` or a dedicated schema package) both sides depend on, so the graph stays acyclic. Core's half of this family is already resolved (siblings reclassified to optional peer + dev deps). Tackle styles + site + icons together rather than piecemeal.
- **Source:** `package.json` (`@pro-laico/site` dep) + `cssProcessor.ts:2` · AUDIT.md → Low. See also `site/PLANNED.md`, `core/PLANNED.md`.

## Notes / lower priority

- **`collection` shallow-merge hazard** — `createDesignSetCollection`/`createShortcutSetCollection` end with `merge ? { ...base, ...merge } : base`. A consumer passing `collection: { hooks }` / `{ fields }` / `{ admin }` fully replaces the plugin's version. Consider deep-merging those keys or documenting the hazard explicitly in the JSDoc. (AUDIT.md → Notes.)
- **SCSS packaging for external publish** — `index.scss` is shipped via `files: ["src"]` and the template's Next build compiles it; a dedicated `./…index.scss` export is only needed if publishing to npm for non-bundler consumers. (AUDIT.md → Low.)
