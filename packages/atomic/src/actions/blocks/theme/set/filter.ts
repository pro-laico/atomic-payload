import type { ActionBlockFilter } from '@pro-laico/atomic/actions'
export const ActSetTheme = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
