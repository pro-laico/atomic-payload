import 'server-only'
import path from 'node:path'
import fs from 'node:fs/promises'

import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { FONT_STATIC_DIR } from './fontDir'

export type FontRole = 'display' | 'sans' | 'serif' | 'mono'

/** Roles in the order the page presents them. */
const FONT_ROLES: FontRole[] = ['display', 'sans', 'serif', 'mono']

/** The active selection's metadata — works regardless of delivery (inline or
 *  next/font) or storage adapter, since it's a plain DB read of the global. */
export type ActiveFont = { role: FontRole; title: string; filename: string; mimeType: string }

type FontDoc = { title?: string | null; filename?: string | null; mimeType?: string | null }
type FontSetGlobal = Partial<Record<FontRole, FontDoc | string | null>>

/**
 * Reads the active font selection (role → font) from the `fontSet` global. Only
 * metadata — no bytes — so it's safe in any storage/delivery mode. Wrapped in
 * React `cache()` so the layout and page share one read per request; the route
 * is `force-dynamic`, so changes show up on the next render.
 */
export const getActiveFonts = cache(async (): Promise<ActiveFont[]> => {
  const payload = await getPayload({ config: configPromise })
  const fontSet = (await payload.findGlobal({ slug: 'fontSet', depth: 1, overrideAccess: true })) as FontSetGlobal

  const active: ActiveFont[] = []
  for (const role of FONT_ROLES) {
    const doc = fontSet?.[role]
    if (doc && typeof doc === 'object' && doc.filename) {
      active.push({ role, title: doc.title ?? role, filename: doc.filename, mimeType: doc.mimeType || 'font/woff2' })
    }
  }
  return active
})

/**
 * Reads an uploaded font's bytes off disk (`FONT_STATIC_DIR`) and returns a
 * base64 `data:` URL — the runtime fallback used by the layout for any role that
 * hasn't been downloaded to `public/fonts`. Returns null if the file isn't on
 * local disk (e.g. an external storage adapter without a local copy).
 */
export async function readFontDataUrl(filename: string, mimeType: string): Promise<string | null> {
  try {
    const bytes = await fs.readFile(path.join(FONT_STATIC_DIR, filename))
    return `data:${mimeType};base64,${bytes.toString('base64')}`
  } catch {
    return null
  }
}
