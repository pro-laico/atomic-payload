import { ActionBlockFilter } from '@pro-laico/atomic-payload-types'

export const ActSetTheme = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
