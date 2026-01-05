import { ActionBlockFilter } from '@/ts/types/actions'

export const ActDSSetBool = ({ blockType, type, placement }: ActionBlockFilter) =>
  Boolean(blockType === 'AtomicChild' && type === 'button' && placement === 'trigger')
