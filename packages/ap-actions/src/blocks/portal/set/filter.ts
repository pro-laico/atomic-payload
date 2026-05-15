import { ActionBlockFilter } from '@pro-laico/ap-actions'
export const ActSetPortalOpen = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
