import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { revalidateTag } from '@pro-laico/core'

import config from '@payload-config'
import { sampleDesignSet, sampleHomePage, sampleShortcutSet } from '@/seed/sampleSets'

/**
 * Creates the demo `shortcutSet`, `designSet`, and home `page`. Auth-gated to
 * logged-in admins. Idempotent — skips any doc whose title/href already exists.
 *
 * Order matters: the `shortcutSet` and `designSet` are created first so that
 * when the home page's `cssHook` runs last, the active shortcuts and design
 * tokens are available and get folded into the generated stylesheet alongside
 * the page's own block classes. Each save runs the processor and writes the
 * result to the `draftStorage` + `publishedStorage` globals.
 *
 * To start from a clean slate, call `POST /api/reset` first.
 */
export async function POST() {
  const payload = await getPayload({ config })
  const reqHeaders = await nextHeaders()
  const { user } = await payload.auth({ headers: reqHeaders })
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const result: Record<'shortcutSet' | 'designSet' | 'page', 'created' | 'exists'> = { shortcutSet: 'exists', designSet: 'exists', page: 'exists' }

  const existingShortcut = await payload.find({
    collection: 'shortcutSet',
    where: { title: { equals: sampleShortcutSet.title } },
    limit: 1,
    depth: 0,
  })
  if (existingShortcut.docs.length === 0) {
    await payload.create({ collection: 'shortcutSet', data: sampleShortcutSet } as Parameters<typeof payload.create>[0])
    result.shortcutSet = 'created'
  }

  const existingDesign = await payload.find({ collection: 'designSet', where: { title: { equals: sampleDesignSet.title } }, limit: 1, depth: 0 })
  if (existingDesign.docs.length === 0) {
    await payload.create({ collection: 'designSet', data: sampleDesignSet } as Parameters<typeof payload.create>[0])
    result.designSet = 'created'
  }

  const existingPage = await payload.find({ collection: 'pages', where: { href: { equals: sampleHomePage.href } }, limit: 1, depth: 0 })
  if (existingPage.docs.length === 0) {
    await payload.create({ collection: 'pages', data: sampleHomePage } as Parameters<typeof payload.create>[0])
    result.page = 'created'
  }

  // The afterChange hooks already revalidate on create; this is belt-and-suspenders
  // so a re-seed that only flips which set is active still busts the cache.
  await revalidateTag('shortcutSet', false)
  await revalidateTag('designSet', false)
  await revalidateTag('atomic-classes', false)

  return NextResponse.json({ ok: true, ...result })
}
