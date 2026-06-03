import path from 'node:path'

/**
 * Where Payload writes uploaded font files (the `font` collection's `staticDir`)
 * and where the frontend reads their bytes back. Kept in its own tiny,
 * dependency-free module so both `payload.config.ts` and the server-only
 * `getFonts` reader can share it without an import cycle through `@payload-config`.
 *
 * Resolved against `process.cwd()` (the template root) — the same in `next dev`,
 * `next build`, and `next start`, and in the Payload CLI. Gitignored.
 */
export const FONT_STATIC_DIR = path.resolve(process.cwd(), 'media')

/** `font-family` name for a given role (`sans`/`serif`/`mono`/`display`). */
export const fontFamilyName = (role: string): string => `apf-${role}`
