import { ActionBlockFilter } from '@pro-laico/ap-types'

export const ActSetPortalOpen = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
