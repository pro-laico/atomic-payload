import { ActionBlockFilter } from '@pro-laico/ap-actions'
export const ActDSCycleText = ({ blockType, type, placement }: ActionBlockFilter) =>
  Boolean(blockType === 'AtomicChild' && type === 'button' && placement === 'trigger')
