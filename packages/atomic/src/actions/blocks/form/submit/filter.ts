import { ActionBlockFilter } from '@pro-laico/atomic/actions'
export const ActSubmitForm = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
