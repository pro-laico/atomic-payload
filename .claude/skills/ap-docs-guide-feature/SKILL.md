---
name: ap-docs-guide-feature
description: How to write the Feature guide pages for the Atomic Payload docs — docs/content/docs/features/*.mdx (styles, actions, forms, icons, media, fonts, site, tracking, atomic-blocks, seeding). Use when creating, editing, or reviewing a feature page. These are the friendly "what it does / how it works / how to use it" capability guides, each paired with a plugin reference page. Builds on the ap-docs-guide skill for shared conventions (frontmatter, tone, components, fences, links).
---

# Feature guide pages

Capability guides under `docs/content/docs/features/`. Each pairs with a `plugins/<x>` page: the **feature page explains the capability and how it works**; the **plugin page is the install/options reference**. Cross-link both and keep them consistent. Follow `ap-docs-guide` for all shared conventions.

## Structure

1. **Intro** — one or two plain sentences: what this feature lets you do.
2. **## Overview** — what it is, who it's for, the value — in plain terms.
3. **## How it works** — the pieces that make it work and how they fit (admin + frontend), without diving into internals. Bullets work well.
4. **## Using it** — the actual steps an editor/developer takes (admin actions; any frontend wiring). A numbered list or `<Steps>`.
5. **## Configuration** — the knobs (options, env), kept brief with a pointer to the plugin page for the full list.
6. **## Provided by** — a `<Cards>` link to the `plugins/<x>` page.
7. **## Related** — `<Cards>` to related features/concepts.

## Notes

- The feature page is the friendly explainer; keep heavy reference (full options tables, every export, exhaustive setup) on the plugin page.
- Lead with outcomes ("swap a font in the admin and the whole site restyles"), not mechanisms.
- Don't frame the no-code builder as the whole point — features are plugin capabilities.

## Checklist

- [ ] Follows `ap-docs-guide` shared conventions.
- [ ] Overview → How it works → Using it → Configuration → Provided by → Related.
- [ ] Cross-links the matching `plugins/<x>` page (Provided by).
- [ ] Outcome-first; reference detail deferred to the plugin page.
