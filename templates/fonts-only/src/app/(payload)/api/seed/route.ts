import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { sampleFonts } from '@/seed/sampleFonts'

/**
 * Uploads the bundled sample fonts to the `font` collection, then points the
 * `fontSet` global at them (one per role) — the active selection the frontend
 * renders. Auth-gated to logged-in admins, idempotent by `title`.
 *
 * Each woff2 is fetched from the template's own `public/seed-fonts/` over the
 * request origin, then handed to `payload.create` via the `file` argument so it
 * runs through the real upload pipeline (Payload writes the file to the
 * collection's `staticDir`).
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

  const created: string[] = []
  const skipped: string[] = []
  // role (sans/serif/mono/display) → uploaded font id, for the fontSet global.
  const selection: Record<string, string | number> = {}

  for (const { file, title, family } of sampleFonts) {
    const existing = await payload.find({ collection: 'font', where: { title: { equals: title } }, limit: 1, depth: 0 })
    if (existing.docs.length > 0) {
      selection[family] = existing.docs[0].id
      skipped.push(title)
      continue
    }

    const res = await fetch(`${origin}/seed-fonts/${file}`)
    if (!res.ok) return NextResponse.json({ ok: false, error: `Could not load seed font ${file} (${res.status})` }, { status: 500 })
    const data = Buffer.from(await res.arrayBuffer())

    const doc = await payload.create({
      collection: 'font',
      data: { title, family },
      file: { data, name: file, mimetype: 'font/woff2', size: data.byteLength },
    } as Parameters<typeof payload.create>[0])
    selection[family] = doc.id
    created.push(title)
  }

  // Activate the uploaded fonts by wiring the fontSet global to them.
  await payload.updateGlobal({
    slug: 'fontSet',
    data: { sans: selection.sans, serif: selection.serif, mono: selection.mono, display: selection.display },
  } as Parameters<typeof payload.updateGlobal>[0])

  return NextResponse.json({ ok: true, created, skipped })
}
