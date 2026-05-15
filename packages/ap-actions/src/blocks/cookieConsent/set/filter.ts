import { ActionBlockFilter } from '@pro-laico/ap-actions'
export const ActSetCC = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
