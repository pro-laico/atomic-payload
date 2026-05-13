import { ActionBlockFilter } from '@pro-laico/atomic-payload-types'

export const ActDSCycleText = ({ blockType, type, placement }: ActionBlockFilter) =>
  Boolean(blockType === 'AtomicChild' && type === 'button' && placement === 'trigger')
