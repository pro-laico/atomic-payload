import { z } from '@pro-laico/atomic-payload-zap'
import { themePerform } from '@pro-laico/atomic-payload-actions/fields/strict/registry/theme'

export const SetThemeSchema = z.ap.add(
  z.object({
    type: z.literal('RunSetTheme'),
    perform: themePerform,
  }),
  { id: 'RunSetTheme' },
)
