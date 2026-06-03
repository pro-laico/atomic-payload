/**
 * Overwritten by `pnpm download:fonts` to declare the active fonts for
 * `next/font/local` (each with a `--font-set*` CSS variable). Empty by default —
 * when no fonts have been downloaded the layout falls back to inlining the
 * active fonts at runtime. Committed (not gitignored) so the layout's import
 * always resolves on a fresh checkout. See README.
 */
const fonts: Record<string, { variable: string }> = {}
export default fonts
