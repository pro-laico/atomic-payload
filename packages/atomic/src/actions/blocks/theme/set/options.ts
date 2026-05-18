import type { ActionProcessFunction } from '@pro-laico/atomic/actions'
import type { z } from '@pro-laico/zap'

const processFunction: ActionProcessFunction<'ActSetTheme'> = ({ perform, data }) => {
  const Run: z.ap.Type<'RunSetTheme'> = { type: 'RunSetTheme', perform }
  data.runners.push(Run)
}

export const ActSetTheme = { processFunction }
