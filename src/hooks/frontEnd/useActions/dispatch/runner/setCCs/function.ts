import type { RunFunction } from '@/ts/types'

export const RunSetCC: RunFunction<'RunSetCC'> = ({
  values,
  context: {
    atomicStore: { preferences, setPreference, acceptCookies, declineCookies },
  },
}) => {
  switch (values.perform) {
    case 'preference':
      if (values.key) setPreference(values.key, !preferences?.[values.key])
      break
    case 'accept':
      acceptCookies(
        values.acceptAll
          ? {
              functional: true,
              security: true,
              analytics: true,
              marketing: true,
              userData: true,
              adPersonalization: true,
              contentPersonalization: true,
            }
          : preferences,
      )
      break
    case 'decline':
      declineCookies()
      break
  }
  return { success: true }
}
