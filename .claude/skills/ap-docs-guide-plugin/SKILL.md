---
name: ap-docs-guide-plugin
description: How to write the per-plugin documentation pages for the atomic-payload (@pro-laico/*) project — the docs/content/docs/plugins/*.mdx pages on the Fumadocs site. Use whenever creating, rewriting, or reviewing a plugin doc page. Covers the plain-language, benefit-first tone for a surface-level Payload/Next/React reader; the full page structure (intro → installation → setup walkthrough → using it in your app → options → environment variables → exports → related); the Fumadocs components to use; and the rule to ground every setup/frontend step in the real package source and the templates/atomic-payload template rather than inventing it. Trigger when documenting or editing any @pro-laico plugin's docs page, even when the user just says "document this plugin", "the plugin docs are incomplete", or "fix the setup section".
---

# Writing Atomic Payload plugin docs

How to document a `@pro-laico/*` package on the Fumadocs docs site (`docs/content/docs/plugins/<name>.mdx`). **Builds on the `ap-docs-guide` skill for the shared docs conventions** (frontmatter, tone, Fumadocs components, Shiki-safe code fences, links, grounding in source) — read that too. This skill covers what's specific to **plugin reference pages**.

## The job

A plugin page must document **the whole package, end to end** — not just "here's a Payload plugin." Most packages have three surfaces a reader needs:

1. **The Payload side** — what to add to `buildConfig`, the options, what collections/globals/fields it registers.
2. **Extra setup steps** — build scripts, generated files, env vars, admin actions (e.g. the fonts download step, the importmap, env keys). These are the most commonly *missing* parts. Always check for them. If a step **generates or downloads files into the project** (e.g. fonts → `public/fonts` + the generated `src/app/definition.ts`), also tell the reader to **gitignore** those outputs — generated artifacts don't belong in version control.
3. **The frontend** — many packages ship React/Next components or generated modules the reader has to wire into their own app. Show how (`icons` → `AtomicIcon`, `tracking` → `TrackingProvider`, `fonts` → the generated `definition.ts`, `atomic`/media/richtext → blocks rendered through atomic's renderer). A plugin page is incomplete if the package has a frontend surface and the page doesn't show how to use it.

State plainly **what the package does and how it's meant to be used.** "It exports a Payload plugin" is not enough.

**Cover both ways to use it** with a `<Tabs items={['Standalone', 'With the atomic-payload template']}>` block in Setup, each tab holding its own `<Steps>` walkthrough. The **Standalone** tab teaches the full DIY path (it's what someone setting it up actually needs); the **template** tab is the short pre-wired flow (the template already includes the build scripts, layout wiring, and env — users usually just upload + pick in the admin, then build). The two tabs' sub-steps differ, so the right-hand anchor list may not line up across them — that's fine. The standalone path often includes steps the template hides: build scripts, env vars, frontend wiring, and gitignoring generated output. Check the matching `examples/<name>-only` app (where one exists) for the real standalone setup. (A package with only one path can skip the tabs.)

## Ground everything in the real source — never invent

The #1 failure mode is guessing at setup/commands. Before writing setup or frontend sections, read the actual code:

- The package's `src/index.ts` (exports + subpaths), `src/plugin.ts` (the real options), `package.json` (`exports`, `bin`, `scripts`), and any `src/scripts/*`, `src/components/**`, `src/globals/**`.
- **`templates/atomic-payload/` is the source of truth for HOW things are wired** — its `package.json` scripts, `.env.example`, and `src/app/**` show the canonical setup and frontend usage. Copy what it actually does.

Example of getting this wrong: the fonts download step is **not** `npx atomic-fonts-download`. The template runs it as a `prebuild` script: `"prebuild": "pnpm generate:fonts"` → `"generate:fonts": "pnpm exec tsx node_modules/@pro-laico/fonts/src/scripts/cli.ts"`, which signs into the deployed site (`LIVE_SITE_URL` + `SCRIPT_USER_*`) and writes `public/fonts` + a generated `src/app/definition.ts`. Read the template; don't assume a published-bin flow exists.

## Tone (plugin specifics)

`ap-docs-guide` covers the shared tone (plain, benefit-first, surface-level reader, no jargon). Two things specific to plugin pages:

- **Intro pattern:** `` `@pro-laico/<name>` `` + verb + benefit (e.g. "brings your whole design system into the Payload admin"; "makes your SVG icons part of the CMS"). Keep internals (exports, type machinery, architecture) out of the intro — they belong in the reference sections.
- **Match emphasis to the package taxonomy:** **standalones** (fonts/icons/styles/tracking) get the fullest "add it to your project" treatment; **foundation/tools** (core/zap and the tools) can open with "you rarely install this directly — the other plugins bring it along."

## Page structure

Use these sections in order; omit ones that don't apply (e.g. no Environment variables / no frontend section for a package without them).

1. **Frontmatter** — `title` is the package name (`"@pro-laico/<name>"`); `description` is one approachable, benefit-first sentence (this is the search/social snippet, so keep it readable, not a feature dump).
2. **Intro paragraph** — 1–3 plain sentences: what it does and why you'd want it.
3. **## Installation** — `<Tabs groupId="package-manager" items={['pnpm','npm','yarn']}>` with one fenced `bash` install per tab, then a short `<Callout type="info">` naming the peers in plain language (don't over-table peers).
4. **## Setup** — when the package has both a standalone and a template path, wrap Setup in `<Tabs items={['Standalone', 'With the atomic-payload template']}>` with a `<Steps>` walkthrough inside each tab (see "Cover both ways to use it" above). The first standalone step is almost always "Add the plugin to your Payload config" with a `ts` `buildConfig` snippet; add a `<Step>` for each extra setup action (admin steps, the build/generate script, gitignoring generated output, env wiring) — taken verbatim from the template. A single-path package can use a plain `<Steps>` with no tabs.
5. **Frontend usage** — where the package has frontend pieces. Either a `<Step>` ("Use it in your app") inside Setup or its own `## Using it in your app` section. Show the real import (often a subpath), a small `tsx` example, and where it goes (layout, a block, etc.).
6. **## Options** — a `<TypeTable>` of the plugin options, with plain-language descriptions (say what the option does for the user, not its internal merge mechanics).
7. **## Environment variables** — a `| Variable | Purpose |` table, where the package reads any.
8. **## Exports** — an `<ExportTable>` (a project-custom component in `docs/src/components/`) listing every exported item. Each row: the key is the export name; `type` is its **kind** (`plugin`, `collection`, `global`, `field`, `function`, `constant`, `type`, `object`, …); `location` is the import path (`@pro-laico/<name>` or a subpath); `description` is a plain-language explanation. Cover the plugin, its options type, the collections/globals (+ any factories/constants), the fields, any script functions, and the `/schema` types — group same-named value/type pairs into one row, e.g. `'Font / FontSet (types)'` (quote keys that aren't plain identifiers). Keep descriptions plain, not internals-heavy.
9. **## Related** — `<Cards>` linking the matching `features/<name>` page and closely-related plugins. Verify every link target exists before adding it.

## Checklist

- [ ] Intro leads with the plain benefit; no jargon, no internals up front.
- [ ] Every setup/frontend step was verified against the package source AND `templates/atomic-payload` — nothing invented.
- [ ] Extra setup steps (scripts, generated files, env vars, admin actions) are present, not just the `buildConfig` line.
- [ ] Both use cases covered via Setup `<Tabs>` (Standalone + atomic-payload template), each with its own `<Steps>`.
- [ ] Any files the package generates/downloads into the project are called out for `.gitignore`.
- [ ] If the package has frontend components/modules, the page shows how to use them with a real import + `tsx` example.
- [ ] Options table reads in plain language; env vars table present if the package reads any.
- [ ] Fumadocs components used (no imports); fences labeled; all `Related`/inline links resolve.
- [ ] No banned jargon ("binaries", "bin", "storage-agnostic", bare "runtime/namespaces", kernel-speak in the intro).
