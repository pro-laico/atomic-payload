import type { RunFunction } from '@/ts/types/actions'

export const RunSetTheme: RunFunction<'RunSetTheme'> = ({ perform, context: { theme } }) => {
  if (!theme) {
    console.error('RunSetTheme: theme is undefined')
    return { success: false, message: '[RunSetTheme] Theme is undefined' }
  }
  const { setTheme, theme: currentTheme } = theme
  setTheme(perform === 'cycle' ? (currentTheme === 'light' ? 'dark' : 'light') : perform)
  return { success: true }
}
