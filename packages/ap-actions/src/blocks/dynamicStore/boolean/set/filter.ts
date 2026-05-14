import { ActionBlockFilter } from '@pro-laico/ap-types'

export const ActDSSetBool = ({ blockType, type, placement }: ActionBlockFilter) =>
  Boolean(blockType === 'AtomicChild' && type === 'button' && placement === 'trigger')
