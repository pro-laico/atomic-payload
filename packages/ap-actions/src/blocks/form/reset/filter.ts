import { ActionBlockFilter } from '@pro-laico/ap-types'

export const ActResetForm = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
