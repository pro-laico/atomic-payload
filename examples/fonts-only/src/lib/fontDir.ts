import path from 'node:path'

/**
 * Where Payload writes uploaded font files (the `font` collection's `staticDir`).
 * Kept in its own tiny, dependency-free module so `payload.config.ts` can share
 * it without an import cycle through `@payload-config`.
 *
 * Resolved against `process.cwd()` (the project root) — the same in `next dev`,
 * `next build`, and `next start`, and in the Payload CLI. Gitignored.
 */
export const FONT_STATIC_DIR = path.resolve(process.cwd(), 'media')
