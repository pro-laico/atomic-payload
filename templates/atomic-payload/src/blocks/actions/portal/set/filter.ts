import { ActionBlockFilter } from '@pro-laico/atomic-payload-types'

export const ActSetPortalOpen = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
