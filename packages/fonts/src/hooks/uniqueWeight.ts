import { ValidationError, type CollectionBeforeValidateHook } from 'payload'

/**
 * `beforeValidate` for the `Font` (typeface) collection: rejects a typeface whose
 * `files` contain two weight files at the same `(weight, style)`. Each weight +
 * style must resolve to a single file so the generated `next/font/local` `src`
 * array has no conflicting entries.
 *
 * Resolves the referenced `fontFile` documents to read their weight/style (those
 * live on the file, not the typeface). No-ops with fewer than two files.
 */
export const uniqueWeightHook = ({ fontFileSlug = 'fontFile' }: { fontFileSlug?: string } = {}): CollectionBeforeValidateHook => {
  return async ({ data, req }) => {
    const refs = Array.isArray(data?.files) ? data.files : []
    const ids = refs.map((f: unknown) => (f && typeof f === 'object' ? (f as { id?: unknown }).id : f)).filter((id: unknown) => id != null)
    if (ids.length < 2) return data

    const found = await req.payload.find({
      collection: fontFileSlug as never,
      where: { id: { in: ids } },
      depth: 0,
      limit: ids.length,
      overrideAccess: true,
      req,
    })

    const seen = new Set<string>()
    for (const file of found.docs as Array<{ weight?: string | null; style?: string | null }>) {
      const key = `${file.weight ?? ''}|${file.style ?? ''}`
      if (seen.has(key)) {
        throw new ValidationError({
          errors: [
            {
              path: 'files',
              message: `This typeface has two files at the same weight + style (${file.weight ?? '?'} ${file.style ?? 'normal'}). Each weight + style must be unique.`,
            },
          ],
          req,
        })
      }
      seen.add(key)
    }
    return data
  }
}
