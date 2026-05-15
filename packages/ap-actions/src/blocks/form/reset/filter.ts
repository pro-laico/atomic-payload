import { ActionBlockFilter } from '@pro-laico/ap-actions'
export const ActResetForm = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
