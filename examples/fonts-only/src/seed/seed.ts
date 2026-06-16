import type { Payload } from 'payload'

import { sampleFonts } from './sampleFonts'

/** Loads the raw bytes for a sample font file (e.g. `inter.woff2`). The route
 *  fetches it over the request origin from `public/seed-fonts/`; the test reads
 *  it straight off disk. */
export type LoadFontFile = (file: string) => Promise<Buffer>

/**
 * For each bundled sample font: upload the file to `fontFile` (the optimized
 * weight-file collection) and create a one-weight `font` typeface referencing
 * it, then point the `fontSet` global at the typefaces (one per role). Idempotent
 * by typeface `title`. Pure data logic, no HTTP/auth: the `/api/seed` route
 * auth-gates and injects an origin-fetch loader; the integration test injects a
 * disk loader. `overrideAccess: true` makes the trusted server-side bypass explicit.
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
  // role (sans/serif/mono/display) → typeface id, for the fontSet global.
  const selection: Record<string, string | number> = {}

  for (const { file, title, family } of sampleFonts) {
    const existing = await payload.find({ collection: 'font', where: { title: { equals: title } }, limit: 1, depth: 0, overrideAccess: true })
    if (existing.docs.length > 0) {
      selection[family] = existing.docs[0].id
      skipped.push(title)
      continue
    }

    const data = await loadFile(file)
    // The weight file (a single 400/normal weight for the demo).
    const fileDoc = await payload.create({
      collection: 'fontFile',
      overrideAccess: true,
      data: { weight: '400', style: 'normal' },
      file: { data, name: file, mimetype: 'font/woff2', size: data.byteLength },
    } as Parameters<typeof payload.create>[0])
    // The typeface, referencing its one weight file.
    const typeface = await payload.create({
      collection: 'font',
      overrideAccess: true,
      data: { title, family, files: [fileDoc.id] },
    } as Parameters<typeof payload.create>[0])
    selection[family] = typeface.id
    created.push(title)
  }

  // Activate the typefaces by wiring the fontSet global to them — one typeface
  // per role (single relationship).
  await payload.updateGlobal({
    slug: 'fontSet',
    overrideAccess: true,
    data: {
      sans: selection.sans ?? null,
      serif: selection.serif ?? null,
      mono: selection.mono ?? null,
      display: selection.display ?? null,
    },
  } as Parameters<typeof payload.updateGlobal>[0])

  return { created, skipped }
}
