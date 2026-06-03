# @pro-laico/richtext — Payload Plugin Audit

## Summary

The package is small and well-scoped: a Payload block factory, a default Lexical preset, and a JSX renderer built on `@payloadcms/richtext-lexical/react`. Architecture is correct for the monorepo (no `'use client'` needed because the renderer is pure JSX serialization). The main issues are an unsafe cast + uncaught throw in the internal-link converter that will crash the renderer at runtime, a no-op build script with raw `.ts` paths in `exports` (works in monorepo, breaks published), and a superfluous `"./src"` export entry that leaks internal structure as a public API path.

## Findings

> **Status:** Critical + the related `href`-cast High fixed — `internalDocToHref` now returns a safe `'#'` fallback instead of throwing/casting. No-op-build/exports-to-src and the remaining mediums/lows are intentional-for-workspace or deferred.

### 🔴 Critical

- [x] **Internal-link converter throws during render** — `src/blocks/richText/component/converters/internalLink.tsx:4,6` — `internalDocToHref` throws `Error` if `linkNode.fields.doc` is null/undefined or if `value` is not a populated object (depth-0 fetch returns a string ID). A throw inside a JSX converter propagates uncaught through `convertLexicalToJSX`, crashing the entire `<RichTextChild>` subtree with no user-visible fallback. **Fix:** Return a safe fallback string (e.g. `'#'`) instead of throwing, and add a guard: `if (!linkNode.fields.doc || typeof value !== 'object') return '#'`. Also ensure the query that feeds `<RichTextChild>` fetches at depth ≥ 1 or uses `defaultPopulate` on `pages` (which it already does, but the renderer has no defence if that invariant is violated).

### 🟠 High

- [x] **`value.href` is cast to `string` without a null guard** — _Fixed together with the Critical: `href` is type-checked and falls back to `'#'`._ — `src/blocks/richText/component/converters/internalLink.tsx:8` — `return value.href as string` silently returns `undefined` (typed as `string`) if `href` is not present on the populated doc (e.g. unpopulated relationship, or a future collection that lacks `href`). The broken link is rendered as `href="undefined"` in the DOM. **Fix:** Replace with `const href = (value as Record<string, unknown>).href; if (typeof href !== 'string' || !href) return '#'; return href` — or at minimum assert: `if (typeof value.href !== 'string') throw new Error(\`internalDocToHref: missing href on doc ${(value as { id?: string }).id}\`)`.

- [ ] **No-op build script with raw `.ts` in `exports`** — `package.json:10-24,31` — `"build": "node -e \"process.exit(0)\""` performs no compilation. `"main"`, `"types"`, and all `"exports"` entries point directly to `.ts` source files. This works only because consuming packages in this monorepo use a bundler that resolves raw TypeScript. If the package is ever published to npm or consumed outside a TypeScript-aware bundler, all imports will fail. **Fix:** Either (a) add a real build step (e.g. `tsup` or `tsc`), update exports to `./dist/…`, and set `"files": ["dist"]`; or (b) add an explicit comment/constraint documenting that this package is monorepo-only and must not be published, and remove `"publishConfig": { "access": "public" }` (line 7–9) which implies it is meant for npm.

### 🟡 Medium

- [x] **Superfluous `"./src"` export entry** — _Fixed: removed the `"./src"` exports entry (no consumer referenced it)._ — `package.json:17-20` — `"./src"` is a second alias for the same `./src/index.ts` file already exposed as `"."`. It leaks an implementation path as a stable public API surface (any consumer that imports `@pro-laico/richtext/src` is now depending on a path that has no semantic meaning). **Fix:** Remove the `"./src"` entry entirely.

- [x] **`defaultLexical` hard-codes `enabledCollections: ['pages']`** — _Fixed: added `createDefaultLexical({ enabledCollections })` factory (defaults to `['pages']`); `defaultLexical` is now `createDefaultLexical()`._ — `src/blocks/richText/defaultLexical.ts:41` — The preset couples itself to the `pages` collection slug. A project with a different collection name (or additional linkable collections) must copy-paste the entire preset to change one option. **Fix:** Accept an optional `options` parameter (e.g. `createDefaultLexical({ enabledCollections?: string[] } = {})`) and fall back to `['pages']` when not provided. Export both the factory and a pre-called default.

- [x] **README references a `types/` directory that does not exist** — _Fixed: removed the `types/` row from the "What lives in `src/`" table._ — `README.md:44-47` — The "What lives in `src/`" table lists `types/ — Type helpers` as a path in this package. No such directory exists under `src/`. **Fix:** Remove or correct that table row.

- [x] **`component.tsx` spreads `pt?.c?.p` with unnecessary optional chaining on `pt`** — _Fixed: now `pt.c.p` (both `pt` and `c` are non-optional in `RenderChild`/`PassThroughs`)._ — `src/blocks/richText/component.tsx:6` — `pt` is typed as `PassThroughs` (non-optional) in `RenderChild<T>`, so `pt?.c?.p` implies `pt` can be absent when the type says it cannot. This is misleading to readers and suppresses a type error that would catch a real contract violation. **Fix:** Use `pt.c.p` (no optional chaining on `pt`). Keep `?.p` on `c` only if `PassThrough.p` is optional (which it is).

### 🟢 Low / nice-to-have

- [ ] _Reviewed — low priority, left as-is: extra DOM attrs in `...rest` **are** forwarded to `ConvertRichText`, and `@payloadcms/richtext-lexical/react` tolerates them; narrowing `Props` is cosmetic and would only restrict a working pass-through._ **`RichText` wrapper in `component/index.tsx` accepts `React.HTMLAttributes<HTMLDivElement>` but passes them into `ConvertRichText`** — `src/blocks/richText/component/index.tsx:6,10` — `ConvertRichText` only accepts a narrow set of props (`className`, `data`, `converters`, `disableContainer`, `disableIndent`, `disableTextAlign`). Any extra DOM attributes in `...rest` (e.g. `onClick`, `style`, `id`) are silently swallowed by the component's destructuring — they are never applied to any element. **Fix:** Narrow `Props` to only the props `ConvertRichText` actually accepts, or explicitly document which props pass through.

- [ ] **`jsxConverter` is re-created on every render of `RichText`** — `src/blocks/richText/component/converters/index.tsx:8` — `jsxConverter` is defined as a module-level constant, so it is created once per module load (no per-render cost). However, `component/index.tsx` passes it inline: `converters={jsxConverter}`. Since `jsxConverter` is stable (module singleton), this is fine for React reconciliation. No action required unless profiling shows otherwise.

- [ ] _Reviewed — left as-is: `as TextFieldSingleValidation` on the whole validate fn is the idiomatic Payload pattern (the param types are otherwise inferred too narrowly); runtime behaviour is correct._ **`TextFieldSingleValidation` cast in `defaultLexical.ts`** — `src/blocks/richText/defaultLexical.ts:59` — `as TextFieldSingleValidation` silences a TS mismatch between the inline function's inferred type and Payload's expected signature. The runtime behavior is correct, but the cast hides any future signature drift. **Fix:** Explicitly type the validate arrow function parameter list to match `TextFieldSingleValidation` instead of casting the whole function.

## Notes

- `@pro-laico/core` and `@pro-laico/atomic` are listed as `dependencies` (not `peerDependencies`). In a monorepo context this is acceptable, but if the package is published to npm both workspace packages must either also be published or moved to `peerDependencies`.
- The `./default-lexical` subpath export (`package.json:21-24`) is correctly wired to the right file and is resolvable. No issue there.
- No `dangerouslySetInnerHTML` is used anywhere; XSS risk is limited to the link `href` value discussed in the Critical and High findings above.
- `'use client'` is intentionally absent and correctly so: `@payloadcms/richtext-lexical/react`'s `RichText` is a pure JSX serializer (no hooks/state), safe for RSC.
