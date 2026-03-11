import { ActionBlockFilter } from '@/ts/types/actions'

export const ActSetTheme = ({ placement, type }: ActionBlockFilter) => Boolean(placement === 'trigger' && type === 'button')
