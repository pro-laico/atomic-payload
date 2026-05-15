import { z } from '@pro-laico/zap'
import { themePerform } from '@pro-laico/ap-actions/fields/strict/registry/theme'

export const SetThemeSchema = z.ap.add(
  z.object({
    type: z.literal('RunSetTheme'),
    perform: themePerform,
  }),
  { id: 'RunSetTheme' },
)
