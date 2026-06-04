import type { Access } from 'payload'

/**
 * Default access for the `Font` collection and `fontSet` global: any
 * authenticated user. Reads are gated too because font binaries may be licensed.
 *
 * This is intentionally permissive — `@pro-laico/fonts` ships no role model of
 * its own. Projects that need stricter control (e.g. admin-only writes) should
 * override `access` at registration time rather than editing this package:
 *
 * ```ts
 * fontsPlugin({
 *   fontOptions: { access: { create: adminOnly, update: adminOnly, delete: adminOnly } },
 *   includeFontSet: true,
 *   fontSetOptions: { access: { update: adminOnly } },
 * })
 * ```
 */
export const authd: Access = ({ req }) => Boolean(req.user)
