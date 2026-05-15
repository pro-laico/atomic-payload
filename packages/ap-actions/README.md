# @pro-laico/ap-actions

Atomic Payload action-block plugin. Re-exports the action type surface from `@pro-laico/ap-types` and provides a Payload plugin factory for registering action blocks.

```ts
import { actionsPlugin } from '@pro-laico/ap-actions'
import { AllActionBlocks } from '@pro-laico/ap-actions/blocks'

export default buildConfig({
  plugins: [actionsPlugin({ blocks: AllActionBlocks })],
})
```

### Roadmap

The 12 action block definitions, their filters/options/processor, and the `useActions` frontend hook tree currently live in the consuming template because they depend on template-only fields (`KeySelectField`, `ChangeKeyField`, `SetDataField`, `PerformSelectField`). Those will move into this package once the dependent field utilities are also extracted.

<!-- workspace-deps:start (auto-generated, do not edit) -->

## Workspace dependencies

Other `@pro-laico/*` packages this package depends on:

- [`ap-apf`](../ap-apf)
- [`ap-atomic-hook`](../ap-atomic-hook)
- [`ap-child-blocks`](../ap-child-blocks)
- [`ap-forms`](../ap-forms)
- [`ap-types`](../ap-types)
- [`ap-zap`](../ap-zap)

Other `@pro-laico/*` packages that depend on this one:

- [`ap-atomic-hook`](../ap-atomic-hook)
- [`ap-child-blocks`](../ap-child-blocks)
- [`ap-forms`](../ap-forms)

<!-- workspace-deps:end -->
