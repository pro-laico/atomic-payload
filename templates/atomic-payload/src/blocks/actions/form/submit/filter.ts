import { ActionBlockFilter } from '@/ts/types/actions'

export const ActSubmitForm = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
