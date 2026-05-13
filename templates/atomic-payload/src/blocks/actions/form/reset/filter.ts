import { ActionBlockFilter } from '@pro-laico/atomic-payload-types'

export const ActResetForm = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
