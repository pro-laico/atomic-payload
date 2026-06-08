import type { ActionBlockFilter } from '@pro-laico/atomic/actions'
export const ActDSCycleText = ({ blockType, type, placement }: ActionBlockFilter) =>
  Boolean(blockType === 'AtomicChild' && type === 'button' && placement === 'trigger')
