import { ActionBlockFilter } from '@/ts/types/actions'

export const ActResetForm = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
