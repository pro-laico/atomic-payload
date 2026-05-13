import { ActionBlockFilter } from '@pro-laico/atomic-payload-types'

export const ActSubmitForm = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
