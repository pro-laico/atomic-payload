import type { CollectionSlug, Payload } from 'payload'

import { ICON_REQUEST_SLUG } from '../collections/iconRequest'

/**
 * Upserts one unresolved icon request into the `iconRequest` collection:
 * increments `count` + bumps `lastRequestedAt` for an existing name, or creates
 * the row. Self-gating — a no-op unless the collection is registered (via
 * `iconsPlugin({ trackRequests: true })`), so it's always safe to call.
 *
 * Deliberately free of `next/server` / `server-only` imports so it can be unit-
 * tested directly against a booted Payload; the request-scoped, throttled,
 * fire-and-forget wrapper lives in {@link file://./trackIconMiss.ts}.
 *
 * Best-effort by contract: callers should not await it on the render path, and
 * any concurrent-create race (two instances, same new name) simply loses one
 * increment.
 */
export const recordIconMiss = async (payload: Payload, name: string): Promise<void> => {
  if (!name) return
  const slug = ICON_REQUEST_SLUG as CollectionSlug
  // No-op when tracking isn't enabled (collection absent).
  if (!(payload.collections as Record<string, unknown>)?.[ICON_REQUEST_SLUG]) return

  const now = new Date().toISOString()
  const existing = await payload.find({ collection: slug, where: { name: { equals: name } }, limit: 1, depth: 0, overrideAccess: true })
  const doc = existing.docs[0] as { id: string | number; count?: number | null } | undefined

  // Args are cast because `iconRequest` may not exist in a consumer's GENERATED
  // payload types (they need not regenerate to use tracking), so the strict
  // per-collection `data` union would otherwise reject these fields.
  if (doc) {
    await payload.update({
      collection: slug,
      id: doc.id,
      data: { count: (doc.count ?? 0) + 1, lastRequestedAt: now },
      overrideAccess: true,
    } as Parameters<typeof payload.update>[0])
  } else {
    await payload.create({
      collection: slug,
      data: { name, count: 1, firstRequestedAt: now, lastRequestedAt: now },
      overrideAccess: true,
    } as Parameters<typeof payload.create>[0])
  }
}
