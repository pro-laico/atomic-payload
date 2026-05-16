# Monorepo Development

This document is for contributors and maintainers working on the Atomic Payload monorepoâ€”structure, local development, publishing the CLI, and adding plugins.

## Structure

```
atomic-payload/
â”œâ”€â”€ packages/
â”‚   â”œâ”€â”€ create-atomic-payload/         # CLI to scaffold new projects
â”‚   â”œâ”€â”€ ap-types/          # Shared TypeScript types
â”‚   â”œâ”€â”€ zap/            # zod + AtomicRegistry helper
â”‚   â”œâ”€â”€ ap-utils/                      # revalidateTag + hooks + getCached factory + plugin
â”‚   â”œâ”€â”€ ap-apf/            # APF runtime, fields, admin UI
â”‚   â”œâ”€â”€ ap-icons/          # iconsPlugin: Icon + iconSet; AtomicIcon; iconSelect factory
â”‚   â”œâ”€â”€ ap-images/         # Images + Favicons + FaviconField
â”‚   â”œâ”€â”€ ap-fonts/          # fontsPlugin + Font collection + download CLI
â”‚   â”œâ”€â”€ ap-mux-video/      # MuxVideo wrapper plugin
â”‚   â”œâ”€â”€ ap-tracking/                   # Tracking plugin: Tracking global + PostHogProperty + GTM/PostHog/Vercel providers
â”‚   â”œâ”€â”€ ap-actions/        # actionsPlugin + action blocks
â”‚   â”œâ”€â”€ ap-forms/            # formsPlugin + submit-form blocks + processor
â”‚   â”œâ”€â”€ children/   # childBlocksPlugin + child blocks
â”‚   â”œâ”€â”€ ap-design-sets/    # designSetsPlugin: designSet + shortcutSet
â”‚   â””â”€â”€ ap-atomic-hook/    # atomicHookPlugin + sanitizeData/log
â”œâ”€â”€ templates/
â”‚   â””â”€â”€ atomic-payload/                # Full Atomic Payload starter template
â””â”€â”€ package.json                       # Workspace root
```

## Packages

| Package                                  | Description                                                     |
| ---------------------------------------- | --------------------------------------------------------------- |
| `@pro-laico/create-atomic-payload`       | CLI to scaffold new Atomic Payload projects                     |
| `@pro-laico/ap-types`        | Shared TypeScript types (decoupled via PayloadAugment)          |
| `@pro-laico/zap`          | zod + AtomicRegistry helper                                     |
| `@pro-laico/ap-utils` | revalidateTag + collection/global hooks + plugin                |
| `@pro-laico/ap-apf`          | Atomic Payload Functions: runtime, fields, admin UI             |
| `@pro-laico/icons`        | iconsPlugin (Icon + iconSet), formatSVG, AtomicIcon, createIconSelect       |
| `@pro-laico/images`       | Images + Favicons collections + FaviconField + blur integration |
| `@pro-laico/fonts`        | fontsPlugin + Font collection + font download CLI / API            |
| `@pro-laico/mux-video`    | MuxVideo extension collection + plugin wrapper                  |
| `@pro-laico/tracking`                 | Tracking plugin: Tracking global (GTM + PostHog tabs + toggles) + PostHogProperty collection + GTM/PostHog/Vercel/composite providers |
| `@pro-laico/atomic/actions`    | actionsPlugin + action blocks + type re-exports                 |
| `@pro-laico/atomic/forms`      | formsPlugin + submit-form SVR blocks + server processor         |
| `@pro-laico/atomic/children` | childBlocksPlugin + default child blocks                      |
| `@pro-laico/design-sets`  | designSetsPlugin: `designSet` + `shortcutSet` collections + token fields |
| `@pro-laico/atomic/hook`  | atomicHookPlugin + sanitizeData + manualLogger                  |

## Templates

| Package                    | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `templates/atomic-payload` | The full starter template (Payload + Next.js + Tailwind) |

## Adding Plugins

Create Payload plugins in `packages/` (e.g. `packages/atomic-payload-<name>`). Each package can be:

- **Used independently**: `pnpm add @pro-laico/atomic-payload-<name>`
- **Used via the template**: Add to the template's dependencies with `workspace:*` for local dev

The standard package shape is documented in the [extraction plan](.cursor/plans/) and visible in every existing package: a `(opts) => (config) => config` plugin factory as both the default export and a named export, with the raw collections/hooks/fields/components also exported as named imports for advanced consumers.
