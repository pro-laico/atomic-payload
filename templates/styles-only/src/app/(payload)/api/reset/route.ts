import config from '@payload-config'
import { revalidateTag } from '@pro-laico/core'

import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'

/**
 * Wipes every `page`, `designSet`, and `shortcutSet` doc. Auth-gated to
 * logged-in admins. The generated CSS in the storage globals is left as-is (it
 * is overwritten on the next seed/save); the page falls back to an empty
 * stylesheet once no active set exists and the cache is busted.
 */
export async function POST() {
  const payload = await getPayload({ config })
  const reqHeaders = await nextHeaders()
  const { user } = await payload.auth({ headers: reqHeaders })
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const pages = await payload.delete({ collection: 'pages', where: { id: { exists: true } } })
  const designSets = await payload.delete({ collection: 'designSet', where: { id: { exists: true } } })
  const shortcutSets = await payload.delete({ collection: 'shortcutSet', where: { id: { exists: true } } })

  await revalidateTag('designSet', false)
  await revalidateTag('shortcutSet', false)
  await revalidateTag('atomic-classes', false)
  await revalidateTag('pages', false)

  return NextResponse.json({
    ok: true,
    deleted: { pages: pages.docs.length, designSets: designSets.docs.length, shortcutSets: shortcutSets.docs.length },
  })
}
