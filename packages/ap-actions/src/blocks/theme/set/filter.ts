import { ActionBlockFilter } from '@pro-laico/ap-actions'
export const ActSetTheme = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
