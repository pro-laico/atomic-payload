import { ActionBlockFilter } from '@pro-laico/atomic/actions'
export const ActDSSetBool = ({ blockType, type, placement }: ActionBlockFilter) =>
  Boolean(blockType === 'AtomicChild' && type === 'button' && placement === 'trigger')
