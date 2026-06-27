/**
 * Lazy Sharp loader with one-time global tuning. `sharp` is an optional peer and kept
 * out of client bundles, so it's imported on first use. On first load we cap the
 * per-image libvips thread pool: the transform endpoint's {@link withTransformLimit}
 * gate already provides cross-image parallelism, so each transform defaults to a single
 * libvips thread to bound memory on serverless (libaom still manages its own threads
 * for AVIF regardless of this). Override via the endpoint's `sharpConcurrency` option or
 * `IMAGES_SHARP_CONCURRENCY`; `0` resets Sharp to its default (CPU-core count). The
 * libvips operation cache is left at Sharp's default (50MB / 20 files / 100 ops), which
 * the docs recommend keeping enabled.
 */
type SharpFactory = (typeof import('sharp'))['default']

let override: number | undefined
let configured = false

/** Set the per-image libvips thread cap applied on the next Sharp load (negative ignored). */
export const setSharpConcurrency = (n?: number): void => {
  if (n != null && Number.isFinite(n) && n >= 0) override = Math.floor(n)
}

export const loadSharp = async (): Promise<SharpFactory> => {
  const sharp = (await import('sharp')).default
  if (!configured) {
    configured = true
    const env = Number(process.env.IMAGES_SHARP_CONCURRENCY)
    const n = override ?? (Number.isFinite(env) && env >= 0 ? Math.floor(env) : 1)
    try {
      sharp.concurrency(n)
    } catch {}
  }
  return sharp
}
