# Packages

This directory contains publishable packages for the Atomic Payload monorepo.

## Current packages

- **create-atomic-payload** – CLI to scaffold new Atomic Payload projects (`npx create-atomic-payload`)

## Future packages

Add Payload plugins here. Each plugin can be:

- Used independently: `pnpm add @your-scope/payload-plugin-name`
- Used via the Atomic Payload template (which depends on all plugins)

### Plugin structure

```
packages/
  @your-scope/
    payload-plugin-example/
      package.json
      src/
        index.ts
        plugin.ts
      tsconfig.json
```

Or unscoped:

```
packages/
  payload-plugin-example/
    package.json
    ...
```

The template in `templates/atomic-payload` will reference plugins via `workspace:*` for local development, and published versions for scaffolded projects.
