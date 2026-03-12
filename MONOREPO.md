# Monorepo Development

This document is for contributors and maintainers working on the Atomic Payload monorepo—structure, local development, publishing the CLI, and adding plugins.

## Structure

```
atomic-payload/
├── packages/
│   ├── create-atomic-payload/   # CLI to scaffold new projects
│   └── (future plugins)        # Payload plugins - use separately or via template
├── templates/
│   └── atomic-payload/        # The full Atomic Payload starter template
└── package.json               # Workspace root
```

## Quick Start

### Create a new project

To scaffold a project (run from **outside** this repo, e.g. your projects folder):

```bash
pnpx @pro-laico/create-atomic-payload my-project
cd my-project
cp .env.example .env
# Edit .env with your MongoDB URI, Payload secret, etc.
pnpm dev
```

### Develop the template locally

```bash
pnpm install
pnpm dev          # Runs templates/atomic-payload
```

## Packages

| Package                            | Description                                 |
| ---------------------------------- | ------------------------------------------- |
| `@pro-laico/create-atomic-payload` | CLI to scaffold new Atomic Payload projects |

## Templates

| Package                    | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `templates/atomic-payload` | The full starter template (Payload + Next.js + Tailwind) |

## Adding Plugins

Create Payload plugins in `packages/` (e.g. `packages/@create-atomic-payload`). Each plugin can be:

- **Used independently**: `pnpm add @pro-laico/example-package`
- **Used via the template**: Add to the template's dependencies with `workspace:*` for local dev

See `packages/README.md` for plugin structure details.
