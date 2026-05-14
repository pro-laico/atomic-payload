import { ActionBlockFilter } from '@pro-laico/ap-types'

export const ActSubmitForm = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
