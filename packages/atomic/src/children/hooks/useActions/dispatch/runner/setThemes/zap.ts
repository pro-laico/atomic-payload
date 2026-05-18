import { themePerform } from '@pro-laico/atomic/actions/fields/strict/registry/theme'
import { z } from '@pro-laico/zap'

export const SetThemeSchema = z.ap.add(
  z.object({
    type: z.literal('RunSetTheme'),
    perform: themePerform,
  }),
  { id: 'RunSetTheme' },
)
