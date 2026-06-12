import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { revalidateTag } from '@pro-laico/core'
import { headers as nextHeaders } from 'next/headers'

import { seedIcons } from '@/seed/seed'

/**
 * Seeds every entry in `sampleIconSets` (see `@/seed/seed`): uploads each set's
 * SVGs to the `icon` collection, then creates a matching `iconSet` doc.
 * Auth-gated to logged-in admins. Re-running REPLACES the sample data — every
 * `iconSet` is cleared and each sample `icon` (and its file) is deleted before
 * being re-uploaded — so it always lands on a clean, current state.
 */
export async function POST() {
  const payload = await getPayload({ config })
  const reqHeaders = await nextHeaders()
  const { user } = await payload.auth({ headers: reqHeaders })
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const { sets } = await seedIcons({ payload })

  await revalidateTag('iconSet', false)

  return NextResponse.json({ ok: true, sets })
}
