import 'server-only'
import type { RevalidationLoggerType } from '@pro-laico/ap-types'

export default function revalidationLogger(tags: RevalidationLoggerType) {
  if (process?.env?.LOGS === 'true') console.log('\x1b[38;5;226m%s\x1b[0m', `[Revalidate] - Tags | ${tags.join(' | ')}`)
}
