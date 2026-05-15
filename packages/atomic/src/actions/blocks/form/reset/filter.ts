import { ActionBlockFilter } from '@pro-laico/atomic/actions'
export const ActResetForm = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
