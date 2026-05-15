import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

import { sampleIcons, sampleIconSetTitle, sampleIconSetEntries } from '@/seed/sampleIcons'

/**
 * Seeds the Icon collection (and a single Demo Icon Set) with the SVGs in
 * `src/seed/sampleIcons.ts`. Auth-gated to logged-in admins. Idempotent: skips
 * any icon whose filename already exists, and creates the IconSet only when
 * absent.
 *
 * Trigger from the demo home page or with curl after logging into /admin.
 */
export async function POST() {
  const payload = await getPayload({ config })
  const reqHeaders = await nextHeaders()
  const { user } = await payload.auth({ headers: reqHeaders })
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const created: string[] = []
  const skipped: string[] = []
  const filenameToId = new Map<string, string | number>()

  for (const { filename, svg } of sampleIcons) {
    const existing = await payload.find({
      collection: 'icon',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs.length > 0) {
      skipped.push(filename)
      filenameToId.set(filename, existing.docs[0].id)
      continue
    }
    const doc = await payload.create({
      collection: 'icon',
      data: {},
      file: { data: Buffer.from(svg, 'utf8'), name: filename, mimetype: 'image/svg+xml', size: Buffer.byteLength(svg, 'utf8') },
    })
    created.push(filename)
    filenameToId.set(filename, doc.id)
  }

  let iconSetStatus: 'created' | 'exists' = 'exists'
  const existingSet = await payload.find({
    collection: 'iconSet',
    where: { title: { equals: sampleIconSetTitle } },
    limit: 1,
    depth: 0,
  })
  if (existingSet.docs.length === 0) {
    const iconsArray = sampleIconSetEntries
      .map(({ name, filename }) => {
        const id = filenameToId.get(filename)
        return id ? { name, icon: id } : null
      })
      .filter(Boolean) as { name: string; icon: string | number }[]
    await payload.create({
      collection: 'iconSet',
      data: {
        title: sampleIconSetTitle,
        active: true,
        iconsArray,
      } as Parameters<typeof payload.create>[0]['data'],
    })
    iconSetStatus = 'created'
  }

  return NextResponse.json({ ok: true, created, skipped, iconSet: iconSetStatus })
}
