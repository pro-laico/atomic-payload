import { z } from '@/ts/zap'
import { ActionProcessFunction } from '@/ts/types/actions'

const processFunction: ActionProcessFunction<'ActSetTheme'> = ({ perform, data }) => {
  const Run: z.ap.Type<'RunSetTheme'> = { type: 'RunSetTheme', perform }
  data.runners.push(Run)
}

export const ActSetTheme = { processFunction }
