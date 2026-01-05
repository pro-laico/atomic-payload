import { z } from '@/ts/zap'
import { themePerform } from '@/fields/actions/strict/registry/theme'

export const SetThemeSchema = z.ap.add(
  z.object({
    type: z.literal('RunSetTheme'),
    perform: themePerform,
  }),
  { id: 'RunSetTheme' },
)
