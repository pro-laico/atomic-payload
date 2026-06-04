---
name: ap-docs-guide
description: The shared, docs-wide guide for the Atomic Payload (@pro-laico/*) documentation site — the Fumadocs project under docs/. Use whenever creating, editing, or reviewing ANY docs/content/docs/**/*.mdx page. Covers the conventions every doc type shares — frontmatter, meta.json navigation, the plain benefit-first tone for a surface-level Payload/Next/React reader, the Fumadocs components to use, Shiki-safe code fences, link rules, and grounding content in real source — and maps each doc type to its focused companion skill (ap-docs-guide-plugin / -feature / -concept / -getting-started / -example / -template / -contributing). Trigger for any docs-site editing, even when the user just says "fix the docs" or "write a docs page"; then also read the matching type skill for that page's structure.
---

# Atomic Payload docs — shared guide

The docs are a Fumadocs app at `docs/`. Pages are MDX under `docs/content/docs/**`; the sidebar/nav comes from `meta.json` files (not frontmatter `order`). This is the shared foundation — for a specific page, also read the matching type skill below.

## Doc types → use the focused skill

| Folder | What it is | Skill |
| --- | --- | --- |
| `index.mdx` | The docs landing / Introduction | this skill |
| `getting-started/` | Procedural setup walkthroughs | `ap-docs-guide-getting-started` |
| `concepts/` | Explanatory architecture / concepts | `ap-docs-guide-concept` |
| `features/` | Capability guides (what it does / how it works) | `ap-docs-guide-feature` |
| `plugins/` | Per-package reference + setup | `ap-docs-guide-plugin` |
| `templates/` | The full starter-template guide | `ap-docs-guide-template` |
| `examples/` | Minimal single-plugin demo apps | `ap-docs-guide-example` |
| `contributing/` | Contributor / maintainer docs | `ap-docs-guide-contributing` |

Pair-ups: each `features/<x>` has a matching `plugins/<x>` (capability guide vs reference), and each `examples/<x>-only` exercises a standalone plugin — cross-link the pair and keep them consistent.

## Frontmatter

Every page has `title` and `description` only:

- `title` becomes the page H1 — **do not repeat it as a `#` heading**; start the body with an intro paragraph, then `##` sections.
- `description` is the search / social snippet — one approachable, benefit-first sentence (not a feature dump).
- No `order` / `label` / `keywords` — nav order is driven by `meta.json`.

## Navigation (meta.json)

Each folder has `{ "title", "pages": [...] }`; the root `docs/content/docs/meta.json` orders the top-level categories. A `"---Label---"` entry in a `pages` array renders a group separator (used in `plugins/` for Foundation / Standalones / Tools). **A new page only appears if its slug is added to its folder's `meta.json`.**

## Tone

Write for a reader with **surface-level** Payload, Next.js, and React knowledge.

- Lead with the goal/benefit in plain words; never open with internals.
- Avoid jargon a surface-level reader wouldn't use: "binaries" → "files", "bin" → "command"/script; also "storage-agnostic", bare "runtime/namespaces", and kernel / `PayloadAugment` / `Get<>` talk up front. Genuinely common terms (`buildConfig`, `next/font/local`, "collection", "component") are fine.
- Second person and direct. Flag gotchas with a `<Callout>`, not long warning paragraphs.

## Fumadocs components (this site — NOT Payload's `<Banner>`)

Registered globally — **never add imports** for them:

- `<Callout type="info">` (also `warn`) — asides/gotchas; open with a plain sentence.
- `<Cards>` + `<Card title href description? />` — link grids (`## Related`, `## Provided by`).
- `<Tabs groupId="package-manager" items={['npm','pnpm','yarn']}>` + `<Tab value="...">` — install / variant blocks.
- `<Steps>` + `<Step>` (each with a `###` heading) — procedural walkthroughs.
- `<TypeTable type={{ ... }} />` — option tables (`{ type, default?, description }` per row).
- `<ExportTable exports={{ ... }} />` — **project-custom** (in `docs/src/components/`): the Exports table on plugin pages, styled to match `TypeTable` (collapsible card rows — collapsed shows the export name + kind, expanding reveals the description + location). Each row is `{ type (kind), location (import path), description }`.
- `<Accordions>` + `<Accordion title="...">` — collapsible items for optional/advanced details (e.g. the template page's deployment integrations).

## Code fences

Always label, and **only with a Shiki-loaded language**, or the build crashes (`ShikiError: Language not found`). Safe: `ts`, `tsx`, `js`, `jsx`, `json`, `bash`, `sh`, `css`, `mdx`, `plaintext`. Niche grammars like `gitignore`, `dotenv`, `env` are **not** loaded — use `plaintext` (add a `# .gitignore` comment for context). Use `ts` for Payload config, `tsx` for React/Next, `bash` for commands, `json` for `package.json`.

## Accuracy

- **Ground everything in real source** — read the package's `src/` and `package.json`, and `templates/atomic-payload/` (its `package.json` scripts, `.env.example`, `src/app/**`) for how things are actually wired. Don't invent commands or flows.
- Use absolute `/docs/...` links and **verify every link target exists** before adding it.

## Related skills

- `payload-docs-style` — general Payload README/doc formatting. This site uses Fumadocs `<Callout>`/`<Cards>`, not `<Banner>`; where they differ, this guide wins.
- The package taxonomy (foundation / standalones / tools) shapes emphasis — standalones get the fullest "use it yourself" treatment.

## Checklist (every page)

- [ ] Frontmatter: `title` + approachable `description`; body starts with an intro paragraph (no repeated H1).
- [ ] New page's slug added to its folder `meta.json`.
- [ ] Plain, benefit-first tone; no banned jargon.
- [ ] Fumadocs components (no imports); every fence labeled with a Shiki-safe language.
- [ ] Content grounded in real source/template; all links verified.
- [ ] Used the matching type skill for this page's structure.
