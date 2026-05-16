import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

import { revalidateTag } from '@pro-laico/core'

/**
 * Wipes every `icon` and `iconSet` doc. Auth-gated to logged-in admins.
 * `iconSet` is deleted first so it doesn't briefly hold dangling references
 * to icons that have already been removed.
 */
export async function POST() {
  const payload = await getPayload({ config })
  const reqHeaders = await nextHeaders()
  const { user } = await payload.auth({ headers: reqHeaders })
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const iconSets = await payload.delete({ collection: 'iconSet', where: { id: { exists: true } } })
  const icons = await payload.delete({ collection: 'icon', where: { id: { exists: true } } })

  await revalidateTag('iconSet', false)

  return NextResponse.json({
    ok: true,
    deleted: { iconSets: iconSets.docs.length, icons: icons.docs.length },
  })
}
