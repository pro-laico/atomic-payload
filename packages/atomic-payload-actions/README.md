# @pro-laico/atomic-payload-actions

Atomic Payload action-block plugin. Re-exports the action type surface from `@pro-laico/atomic-payload-types` and provides a Payload plugin factory for registering action blocks.

```ts
import { actionsPlugin } from '@pro-laico/atomic-payload-actions'
import { AllActionBlocks } from '@/blocks/actions/blocks'

export default buildConfig({
  plugins: [actionsPlugin({ blocks: AllActionBlocks })],
})
```

### Roadmap

The 12 action block definitions, their filters/options/processor, and the `useActions` frontend hook tree currently live in the consuming template because they depend on template-only fields (`KeySelectField`, `ChangeKeyField`, `SetDataField`, `PerformSelectField`). Those will move into this package once the dependent field utilities are also extracted.
