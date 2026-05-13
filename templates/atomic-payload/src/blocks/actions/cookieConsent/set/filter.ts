import { ActionBlockFilter } from '@pro-laico/atomic-payload-types'

export const ActSetCC = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
