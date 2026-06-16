/**
 * Variant purge. Deleting a generated-image doc cascades its stored file removal
 * through the configured storage adapter's `afterDelete` hook, so purging is just a
 * bulk delete by `source` — no direct storage SDK, fully adapter-agnostic. Hooks
 * are best-effort and logged: a failed purge must never block the source write.
 */
import type { CollectionAfterChangeHook, CollectionBeforeDeleteHook, CollectionSlug, Payload, PayloadRequest } from 'payload'

import { GENERATED_IMAGES_SLUG } from '../collections/generatedImages'

export interface PurgeOptions {
  /** Slug of the generated-images collection. Default `generatedImages`. */
  variantSlug?: string
}

/**
 * Delete every generated variant whose `source` is the given image id. Returns the
 * count removed. Pass the calling hook's `req` so the bulk delete joins that
 * operation's transaction (atomicity on transactional adapters); omit it for
 * out-of-request callers.
 */
export const purgeVariantsForSource = async (
  payload: Payload,
  variantSlug: string,
  sourceId: string | number,
  req?: PayloadRequest,
): Promise<number> => {
  const res = await payload.delete({
    collection: variantSlug as CollectionSlug,
    where: { source: { equals: sourceId } },
    overrideAccess: true,
    req,
  })
  // When the adapter has transactions disabled (e.g. the template's Mongo runs with
  // transactionOptions:false) the bulk delete isn't atomic, so surface per-doc failures.
  if (res?.errors?.length) {
    payload.logger.warn(`[images] ${res.errors.length} generated variant(s) failed to purge for source ${sourceId}`)
  }
  return res?.docs?.length ?? 0
}

/**
 * beforeDelete on the source collection → remove all of its generated variants.
 * Runs BEFORE the source row is deleted: on SQL adapters the variants' required
 * `source` FK would otherwise be NULL-ed during the parent delete and trip a
 * NOT NULL constraint. Removing the variants first sidesteps that (and is harmless
 * on Mongo).
 */
export const purgeVariantsBeforeDelete = (opts: PurgeOptions = {}): CollectionBeforeDeleteHook => {
  const variantSlug = opts.variantSlug || GENERATED_IMAGES_SLUG
  return async ({ id, req }) => {
    try {
      await purgeVariantsForSource(req.payload, variantSlug, id, req)
    } catch (err) {
      req.payload.logger.warn(`[images] failed to purge variants on delete of ${id}: ${String(err)}`)
    }
  }
}

/**
 * afterChange on the source collection → purge stale variants when the underlying
 * file or focal point changed (their cache keys are now unreachable). A metadata-only
 * edit (e.g. `alt`) leaves variants valid and is left untouched.
 */
export const purgeStaleVariantsAfterChange = (opts: PurgeOptions = {}): CollectionAfterChangeHook => {
  const variantSlug = opts.variantSlug || GENERATED_IMAGES_SLUG
  return async ({ doc, previousDoc, operation, req }) => {
    if (operation !== 'update') return doc
    const fileChanged = previousDoc?.filename !== doc?.filename
    const focalChanged = previousDoc?.focalX !== doc?.focalX || previousDoc?.focalY !== doc?.focalY
    if (fileChanged || focalChanged) {
      try {
        await purgeVariantsForSource(req.payload, variantSlug, doc.id, req)
      } catch (err) {
        req.payload.logger.warn(`[images] failed to purge stale variants on change of ${doc?.id}: ${String(err)}`)
      }
    }
    return doc
  }
}
