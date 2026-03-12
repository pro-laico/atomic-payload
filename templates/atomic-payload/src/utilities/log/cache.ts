import 'server-only'
import { AllTags } from '@/ts/types'
import { mt } from '@/utilities/mergeTags'

export default function cacheLogger({ tag, tid, draft }: { tag: AllTags; tid?: string; draft?: boolean }) {
  const fullTag: string = mt([tag, tid, draft ? 'draft' : undefined])
  if (process?.env?.LOGS === 'true') console.log('\x1b[32m%s\x1b[0m', `[GET] - ${fullTag}`)
}
