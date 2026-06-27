/**
 * In-memory single-flight: collapse concurrent calls for the same key onto one shared
 * promise, clearing the entry the moment it settles. Two uses in the transform endpoint:
 *
 *  - dedupe the source-identity read across the many srcset widths of one `<img>` that
 *    arrive together (all the same source id), so a cold page does one source lookup per
 *    image instead of one per requested width;
 *  - coalesce variant generation under a thundering herd (many requests for the same
 *    uncached transform), so the expensive read + encode runs once and the rest await it.
 *
 * Per-process and zero-TTL: because the entry is dropped on settle, there's no staleness
 * window — the next call after a burst reads fresh. (Across separate serverless instances
 * it can't dedupe; it's a best-effort per-instance optimization, like the concurrency gate.)
 */
export const createSingleFlight = <K, V>(): ((key: K, fn: () => Promise<V>) => Promise<V>) => {
  const inflight = new Map<K, Promise<V>>()
  return (key, fn) => {
    const existing = inflight.get(key)
    if (existing) return existing
    const p = Promise.resolve()
      .then(fn)
      .finally(() => inflight.delete(key))
    inflight.set(key, p)
    return p
  }
}
