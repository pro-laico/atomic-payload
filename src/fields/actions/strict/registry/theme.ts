import { z } from '@/ts/zap'

export const themeKeys = z.ap.add(z.enum(['mode']), { id: 'ThemeKeys' })
export const themeListen = z.ap.add(z.enum(['mode']), { id: 'ThemeListen' })
export const themePerform = z.ap.add(z.enum(['light', 'dark', 'system', 'cycle']), { id: 'ThemePerform' })

const theme = { key: themeKeys, listen: themeListen, perform: themePerform }

export default theme
