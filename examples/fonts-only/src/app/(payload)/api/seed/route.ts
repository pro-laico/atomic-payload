import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import config from '@payload-config'

import { seedFonts } from '@/seed/seed'

/**
 * Uploads the bundled sample fonts to the `font` collection, then points the
 * `fontSet` global at them (one per role) — the active selection the frontend
 * renders. Auth-gated to logged-in admins, idempotent by `title` (see
 * `@/seed/seed`).
 *
 * Each woff2 is fetched from the app's own `public/seed-fonts/` over the request
 * origin, then handed to `payload.create` so it runs through the real upload
 * pipeline (Payload writes the file to the collection's `staticDir`).
 *
 * To start over, call `POST /api/reset` first.
 */
export async function POST() {
  const payload = await getPayload({ config })
  const reqHeaders = await nextHeaders()
  const { user } = await payload.auth({ headers: reqHeaders })
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const protocol = reqHeaders.get('x-forwarded-proto') ?? 'http'
  const host = reqHeaders.get('host') ?? 'localhost:3000'
  const origin = `${protocol}://${host}`

  const loadFile = async (file: string): Promise<Buffer> => {
    const res = await fetch(`${origin}/seed-fonts/${file}`)
    if (!res.ok) throw new Error(`Could not load seed font ${file} (${res.status})`)
    return Buffer.from(await res.arrayBuffer())
  }

  try {
    const { created, skipped } = await seedFonts({ payload, loadFile })
    return NextResponse.json({ ok: true, created, skipped })
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 })
  }
}
