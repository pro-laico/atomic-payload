import { ActionBlockFilter } from '@pro-laico/atomic/actions'
export const ActSetPortalOpen = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
