import { ActionBlockFilter } from '@pro-laico/ap-types'

export const ActSetTheme = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
