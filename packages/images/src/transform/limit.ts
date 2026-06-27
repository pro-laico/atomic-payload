/**
 * A tiny FIFO concurrency gate for the CPU-bound Sharp transforms. On a cold page the
 * browser fires every srcset width at once; without a cap each spawns a Sharp
 * decode+encode in parallel and the burst can exhaust memory / CPU on a serverless
 * function. This bounds how many run concurrently; the rest queue.
 *
 * The default is `cpus - 1` (min 1), overridable via the `IMAGES_TRANSFORM_CONCURRENCY`
 * env var or the transform endpoint's `maxConcurrency` option. Module-level singleton —
 * shared across every request in the process.
 */
import os from 'node:os'

const envLimit = (): number | undefined => {
  const n = Number(process.env.IMAGES_TRANSFORM_CONCURRENCY)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined
}

let limit = envLimit() ?? Math.max(1, (os.cpus?.().length ?? 4) - 1)
let active = 0
const queue: Array<() => void> = []

/** Override the max concurrent transforms (no-op for non-positive / non-finite values). */
export const setTransformConcurrency = (n?: number): void => {
  if (n != null && Number.isFinite(n) && n > 0) limit = Math.floor(n)
}

const pump = (): void => {
  if (active >= limit) return
  const run = queue.shift()
  if (!run) return
  active++
  run()
}

/** Run `fn` once a concurrency slot frees up; releases the slot when it settles. */
export const withTransformLimit = async <T>(fn: () => Promise<T>): Promise<T> => {
  await new Promise<void>((resolve) => {
    queue.push(resolve)
    pump()
  })
  try {
    return await fn()
  } finally {
    active--
    pump()
  }
}
