import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Payload } from 'payload'

/**
 * Sample images for the demo — real photographs committed under `./sample-images`,
 * each with a deliberately off-center subject. The focal point (`focalX`/`focalY`,
 * as percentages) marks that subject so the on-demand focal-aware crops visibly
 * keep it in frame across aspect ratios, and the differing orientations
 * (landscape / portrait / square) show the responsive `srcset` adapt.
 */
export interface SampleImage {
  alt: string
  /** Focal point as percentages (0–100), marking the off-center subject. */
  focalX: number
  focalY: number
  /** Source file under `./sample-images`, read from disk at seed time. */
  file: string
}

export const sampleImages: SampleImage[] = [
  { alt: 'Landscape sample', focalX: 78, focalY: 32, file: 'lighthouse.png' },
  { alt: 'Portrait sample', focalX: 50, focalY: 22, file: 'balloon.png' },
  { alt: 'Square sample', focalX: 28, focalY: 72, file: 'apple.png' },
]

// Resolve seed assets from the project root (cwd), NOT `import.meta.url`: Next's
// bundler rewrites `new URL(..., import.meta.url)` asset references and mis-resolves
// a dynamic path to a single asset — which silently uploaded the same image under
// every name. `process.cwd()` is the project root under `next dev` / `next start`.
const sampleDir = path.join(process.cwd(), 'src', 'seed', 'sample-images')

/** Read a committed sample image from `src/seed/sample-images`. */
const readSample = (file: string): Buffer => readFileSync(path.join(sampleDir, file))

/**
 * Seeds the `images` collection with {@link sampleImages}. Re-running REPLACES the
 * data: each sample (matched by `alt`) is deleted first — which cascades to its
 * generated variants via the collection's `beforeDelete` hook — then re-uploaded.
 *
 * Pure data logic, no HTTP/auth: the `/api/seed` route auth-gates and calls this;
 * the integration test calls it directly against a freshly-booted Payload.
 */
export async function seedImages({ payload }: { payload: Payload }): Promise<{ created: string[] }> {
  const created: string[] = []

  for (const sample of sampleImages) {
    // Delete any existing sample with this alt first (cascades to its variants),
    // so the re-upload can't collide on a duplicate filename.
    await payload.delete({ collection: 'images', where: { alt: { equals: sample.alt } }, overrideAccess: true })

    const data = readSample(sample.file)
    await payload.create({
      collection: 'images',
      data: { alt: sample.alt, focalX: sample.focalX, focalY: sample.focalY },
      file: { data, name: sample.file, mimetype: 'image/png', size: data.byteLength },
      overrideAccess: true,
    })
    created.push(sample.file)
  }

  return { created }
}

/** Clean-slate counterpart: delete every image (cascading to variants) + any stray variants. */
export async function resetImages({ payload }: { payload: Payload }): Promise<void> {
  await payload.delete({ collection: 'images', where: { id: { exists: true } }, overrideAccess: true })
  await payload.delete({ collection: 'generatedImages', where: { id: { exists: true } }, overrideAccess: true })
}
