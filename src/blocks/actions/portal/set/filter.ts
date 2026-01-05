import { ActionBlockFilter } from '@/ts/types/actions'

export const ActSetPortalOpen = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
