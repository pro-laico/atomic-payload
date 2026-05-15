# @pro-laico/ap-core

Foundational Atomic Payload package. Replaces the legacy trio:

- `@pro-laico/ap-types` â€” kernel: `PayloadAugment` interface, `Get<>` helper, default fallbacks, `Config` stub, generic helpers.
- `@pro-laico/ap-apf` â€” Atomic Payload Functions: field generator, runAPF runtime, hooks, admin UI components.
- `@pro-laico/ap-utils` â€” revalidation plugin, getCached cache helpers, JSON-schema plugin, slug field, UI components, frontend providers, fields, hooks.

The flat subpath shape is preserved from the old packages, just under `@pro-laico/ap-core/...`. Path constants (`APFControlsPath`, `APFieldPath`, `APFieldLabelPath`, `SiteTriggersPath`, `SlugPath`) target the new package.

## Bin

This package ships `ap-core-augment-types` (formerly `ap-augment-types` in `@pro-laico/ap-types`). Templates' `generate:types` script chains it after `payload generate:types` to write the project-specific augment file alongside `payload-types.ts`.

<!-- workspace-deps:start (auto-generated, do not edit) -->

## Workspace dependencies

Other `@pro-laico/*` packages this package depends on:

- [`ap-atomic-hook`](../ap-atomic-hook)
- [`children`](../children)
- [`ap-design-sets`](../ap-design-sets)
- [`ap-forms`](../ap-forms)
- [`ap-images`](../ap-images)
- [`ap-site`](../ap-site)
- [`ap-tracking`](../ap-tracking)

Other `@pro-laico/*` packages that depend on this one:

- [`ap-actions`](../ap-actions)
- [`ap-atomic-hook`](../ap-atomic-hook)
- [`children`](../children)
- [`ap-design-sets`](../ap-design-sets)
- [`ap-fonts`](../ap-fonts)
- [`ap-forms`](../ap-forms)
- [`ap-icons`](../ap-icons)
- [`ap-images`](../ap-images)
- [`ap-mux-video`](../ap-mux-video)
- [`ap-seed`](../ap-seed)
- [`ap-site`](../ap-site)
- [`ap-tracking`](../ap-tracking)
- [`zap`](../zap)

<!-- workspace-deps:end -->
