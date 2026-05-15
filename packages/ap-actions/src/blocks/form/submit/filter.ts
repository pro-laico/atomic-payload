import { ActionBlockFilter } from '@pro-laico/ap-actions'
export const ActSubmitForm = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
