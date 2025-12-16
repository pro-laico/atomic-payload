import { ActionBlockFilter } from '@/ts/types/actions'

export const ActSetCC = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
