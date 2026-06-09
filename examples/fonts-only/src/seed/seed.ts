import type { Payload } from 'payload'

import { sampleFonts } from './sampleFonts'

/** Loads the raw bytes for a sample font file (e.g. `inter.woff2`). The route
 *  fetches it over the request origin from `public/seed-fonts/`; the test reads
 *  it straight off disk. */
export type LoadFontFile = (file: string) => Promise<Buffer>

/**
 * Uploads the bundled sample fonts to the `font` collection, then points the
 * `fontSet` global at them (one per role). Idempotent by `title`. Pure data
 * logic, no HTTP/auth: the `/api/seed` route auth-gates and injects an
 * origin-fetch loader; the integration test injects a disk loader.
 * `overrideAccess: true` makes the trusted server-side bypass explicit.
 */
export async function seedFonts({
  payload,
  loadFile,
}: {
  payload: Payload
  loadFile: LoadFontFile
}): Promise<{ created: string[]; skipped: string[] }> {
  const created: string[] = []
  const skipped: string[] = []
  // role (sans/serif/mono/display) → uploaded font id, for the fontSet global.
  const selection: Record<string, string | number> = {}

  for (const { file, title, family } of sampleFonts) {
    const existing = await payload.find({ collection: 'font', where: { title: { equals: title } }, limit: 1, depth: 0, overrideAccess: true })
    if (existing.docs.length > 0) {
      selection[family] = existing.docs[0].id
      skipped.push(title)
      continue
    }

    const data = await loadFile(file)
    const doc = await payload.create({
      collection: 'font',
      overrideAccess: true,
      data: { title, family },
      file: { data, name: file, mimetype: 'font/woff2', size: data.byteLength },
    } as Parameters<typeof payload.create>[0])
    selection[family] = doc.id
    created.push(title)
  }

  // Activate the uploaded fonts by wiring the fontSet global to them.
  await payload.updateGlobal({
    slug: 'fontSet',
    overrideAccess: true,
    data: { sans: selection.sans, serif: selection.serif, mono: selection.mono, display: selection.display },
  } as Parameters<typeof payload.updateGlobal>[0])

  return { created, skipped }
}
