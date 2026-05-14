import { ActionBlockFilter } from '@pro-laico/ap-types'

export const ActSetCC = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
