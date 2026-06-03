import config from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'

/**
 * Clears the `fontSet` global, then deletes every `font` doc. Auth-gated to
 * logged-in admins. Clearing the global first avoids it briefly pointing at
 * deleted uploads; the `force-dynamic` home page falls back to system fonts on
 * its next render until you re-seed.
 */
export async function POST() {
  const payload = await getPayload({ config })
  const reqHeaders = await nextHeaders()
  const { user } = await payload.auth({ headers: reqHeaders })
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  await payload.updateGlobal({
    slug: 'fontSet',
    data: { sans: null, serif: null, mono: null, display: null },
  } as Parameters<typeof payload.updateGlobal>[0])

  const fonts = await payload.delete({ collection: 'font', where: { id: { exists: true } } })

  return NextResponse.json({ ok: true, deleted: { fonts: fonts.docs.length } })
}
