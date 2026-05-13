# Monorepo Development

This document is for contributors and maintainers working on the Atomic Payload monorepo—structure, local development, publishing the CLI, and adding plugins.

## Structure

```
atomic-payload/
├── packages/
│   ├── create-atomic-payload/         # CLI to scaffold new projects
│   ├── atomic-payload-types/          # Shared TypeScript types
│   ├── atomic-payload-zap/            # zod + AtomicRegistry helper
│   ├── atomic-payload-revalidation/   # revalidateTag + hooks + plugin
│   ├── atomic-payload-apf/            # APF runtime, fields, admin UI
│   ├── atomic-payload-icons/          # iconsPlugin: Icon + iconSet; AtomicIcon; iconSelect factory
│   ├── atomic-payload-images/         # Images + Favicons + FaviconField
│   ├── atomic-payload-fonts/          # fontsPlugin + Font collection + download CLI
│   ├── atomic-payload-mux-video/      # MuxVideo wrapper plugin
│   ├── atomic-payload-posthog/        # PostHogProperty + tab + provider
│   ├── atomic-payload-actions/        # actionsPlugin + action blocks
│   ├── atomic-payload-forms/            # formsPlugin + submit-form blocks + processor
│   ├── atomic-payload-child-blocks/   # childBlocksPlugin + child blocks
│   ├── atomic-payload-design-sets/    # designSetsPlugin: designSet + shortcutSet
│   └── atomic-payload-atomic-hook/    # atomicHookPlugin + sanitizeData/log
├── templates/
│   └── atomic-payload/                # Full Atomic Payload starter template
└── package.json                       # Workspace root
```

## Packages

| Package                                  | Description                                                     |
| ---------------------------------------- | --------------------------------------------------------------- |
| `@pro-laico/create-atomic-payload`       | CLI to scaffold new Atomic Payload projects                     |
| `@pro-laico/atomic-payload-types`        | Shared TypeScript types (decoupled via PayloadAugment)          |
| `@pro-laico/atomic-payload-zap`          | zod + AtomicRegistry helper                                     |
| `@pro-laico/atomic-payload-revalidation` | revalidateTag + collection/global hooks + plugin                |
| `@pro-laico/atomic-payload-apf`          | Atomic Payload Functions: runtime, fields, admin UI             |
| `@pro-laico/atomic-payload-icons`        | iconsPlugin (Icon + iconSet), formatSVG, AtomicIcon, createIconSelect       |
| `@pro-laico/atomic-payload-images`       | Images + Favicons collections + FaviconField + blur integration |
| `@pro-laico/atomic-payload-fonts`        | fontsPlugin + Font collection + font download CLI / API            |
| `@pro-laico/atomic-payload-mux-video`    | MuxVideo extension collection + plugin wrapper                  |
| `@pro-laico/atomic-payload-posthog`      | PostHogProperty + tracking tab + React provider                 |
| `@pro-laico/atomic-payload-actions`    | actionsPlugin + action blocks + type re-exports                 |
| `@pro-laico/atomic-payload-forms`      | formsPlugin + submit-form SVR blocks + server processor         |
| `@pro-laico/atomic-payload-child-blocks` | childBlocksPlugin + default child blocks                      |
| `@pro-laico/atomic-payload-design-sets`  | designSetsPlugin: `designSet` + `shortcutSet` collections + token fields |
| `@pro-laico/atomic-payload-atomic-hook`  | atomicHookPlugin + sanitizeData + manualLogger                  |

## Templates

| Package                    | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `templates/atomic-payload` | The full starter template (Payload + Next.js + Tailwind) |

## Adding Plugins

Create Payload plugins in `packages/` (e.g. `packages/atomic-payload-<name>`). Each package can be:

- **Used independently**: `pnpm add @pro-laico/atomic-payload-<name>`
- **Used via the template**: Add to the template's dependencies with `workspace:*` for local dev

The standard package shape is documented in the [extraction plan](.cursor/plans/) and visible in every existing package: a `(opts) => (config) => config` plugin factory as both the default export and a named export, with the raw collections/hooks/fields/components also exported as named imports for advanced consumers.
