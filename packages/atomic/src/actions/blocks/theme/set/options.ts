import type { z } from '@pro-laico/zap'
import type { ActionProcessFunction } from '@pro-laico/atomic/actions'

const processFunction: ActionProcessFunction<'ActSetTheme'> = ({ perform, data }) => {
  const Run: z.ap.Type<'RunSetTheme'> = { type: 'RunSetTheme', perform }
  data.runners.push(Run)
}

export const ActSetTheme = { processFunction }
