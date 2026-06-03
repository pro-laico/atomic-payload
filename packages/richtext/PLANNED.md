# @pro-laico/richtext — Planned Features & Deferred Work

Forward-looking backlog distilled from `AUDIT.md`. These items are intentionally **not** done today — external-publish readiness or low-priority cosmetics. The corresponding `AUDIT.md` checkbox stays `[ ]` with an inline annotation.

## External-publish readiness

### Real build step + `dist` exports (or mark monorepo-only)
- **What:** `build` is a no-op and `main`/`types`/`exports` point at raw `.ts`. Either (a) add a real build (`tsup`/`tsc`), repoint exports at `./dist/…`, set `files: ["dist"]`; or (b) document that the package is monorepo-only and remove `publishConfig.access: "public"` (which currently implies it's meant for npm).
- **Why deferred:** Works in the monorepo because consumers bundle raw TS. The `publishConfig` mismatch is the thing to resolve when publish intent is decided.
- **Source:** `package.json:7-9,10-24,31` · AUDIT.md → High (annotated intentional-for-workspace).
- **Note:** `@pro-laico/core` and `@pro-laico/atomic` are `dependencies`, not `peerDependencies` — if published, move them to peers (or publish them too).

## Notes / lower priority

- **`RichText` wrapper prop surface** — accepts `React.HTMLAttributes<HTMLDivElement>` but `ConvertRichText` only consumes a narrow set; extra DOM attrs in `...rest` are silently swallowed. Narrowing `Props` is cosmetic and would only restrict a working pass-through. (AUDIT.md → Low.)
- **`TextFieldSingleValidation` cast** in `defaultLexical.ts` is the idiomatic Payload pattern (inline validate params infer too narrowly); runtime behavior is correct. Explicit param typing instead of casting the whole function is optional polish. (AUDIT.md → Low.)
