import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { revalidateTag } from '@pro-laico/core'

import config from '@payload-config'
import { seedStyles } from '@/seed/seed'

/**
 * Creates the demo `shortcutSet`, `designSet`, and home `page` (see
 * `@/seed/seed`). Auth-gated to logged-in admins. Idempotent — skips any doc
 * whose title/href already exists. Each page save runs the CSS processor and
 * writes the result to the `draftStorage` + `publishedStorage` globals.
 *
 * To start from a clean slate, call `POST /api/reset` first.
 */
export async function POST() {
  const payload = await getPayload({ config })
  const reqHeaders = await nextHeaders()
  const { user } = await payload.auth({ headers: reqHeaders })
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const result = await seedStyles({ payload })

  // The afterChange hooks already revalidate on create; this is belt-and-suspenders
  // so a re-seed that only flips which set is active still busts the cache.
  await revalidateTag('shortcutSet', false)
  await revalidateTag('designSet', false)
  await revalidateTag('atomic-classes', false)

  return NextResponse.json({ ok: true, ...result })
}
