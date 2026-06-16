import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'

import { resetImages } from '@/seed/seed'

/** Wipes every image (cascading to its variants) and any stray variants. Auth-gated. */
export async function POST() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await nextHeaders() })
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  await resetImages({ payload })
  return NextResponse.json({ ok: true })
}
