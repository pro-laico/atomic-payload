import type { ActionBlockFilter } from '@pro-laico/atomic/actions'
export const ActSetCC = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
