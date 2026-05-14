import { z } from '@pro-laico/ap-zap'
import { ActionProcessFunction } from '@pro-laico/ap-types'

const processFunction: ActionProcessFunction<'ActSetTheme'> = ({ perform, data }) => {
  const Run: z.ap.Type<'RunSetTheme'> = { type: 'RunSetTheme', perform }
  data.runners.push(Run)
}

export const ActSetTheme = { processFunction }
