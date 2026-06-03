import 'server-only'

import { mt } from '../mergeTags'
import type { AllTags } from '../../types/cache'

export function cacheLogger({ tag, tid, draft }: { tag: AllTags; tid?: string; draft?: boolean }) {
  const fullTag: string = mt([tag, tid, draft ? 'draft' : undefined])
  if (process?.env?.LOGS === 'true') console.log('\x1b[32m%s\x1b[0m', `[GET] - ${fullTag}`)
}
