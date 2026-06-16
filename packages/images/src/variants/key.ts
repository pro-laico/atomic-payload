/**
 * Deterministic cache key for a generated variant. Folds in the source identity
 * (`id` + `filename`) + focal point so a re-upload or focal edit yields a new key,
 * and the transform params + the *resolved* output format so each distinct render
 * is its own variant.
 *
 * Keying on `filename` (not `updatedAt`) deliberately matches what
 * `purgeStaleVariantsAfterChange` triggers on — a file replacement or focal edit.
 * So a metadata-only edit (e.g. `alt`) bumps `updatedAt` but leaves the key (and the
 * stored variants) intact: keys go stale exactly when the purge hook also fires, so
 * unreachable variants are removed in lockstep rather than orphaned.
 */
import { createHash } from 'node:crypto'

import type { ParsedParams } from '../transform/params'

export interface CacheKeyDoc {
  id: string | number
  filename?: string | null
  focalX?: number | null
  focalY?: number | null
}

export const variantCacheKey = (doc: CacheKeyDoc, p: ParsedParams, resolvedFormat: string): string => {
  // PNG is lossless — `quality` is ignored by the encoder, so fold it out of the key
  // (else `fmt=png&q=70` and `fmt=png&q=80` would mint identical-bytes variants).
  const q = resolvedFormat === 'png' ? 0 : p.q
  const raw = [String(doc.id), doc.filename ?? '', p.w ?? '', p.h ?? '', p.fit, q, resolvedFormat, doc.focalX ?? 50, doc.focalY ?? 50].join('|')
  return createHash('sha256').update(raw).digest('hex').slice(0, 24)
}
