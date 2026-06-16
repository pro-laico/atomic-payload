import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'

import { seedImages } from '@/seed/seed'

/**
 * Seeds the `images` collection with the sample images (see `@/seed/seed`).
 * Auth-gated to logged-in admins. Re-running REPLACES the samples (matched by
 * `alt`), cascading to their generated variants, so it always lands on a clean state.
 */
export async function POST() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await nextHeaders() })
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const { created } = await seedImages({ payload })
  return NextResponse.json({ ok: true, created })
}
