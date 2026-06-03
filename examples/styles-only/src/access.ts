import type { Access } from 'payload'

/** Internal access stubs for ap-site's collections/globals. Kept private to
 *  the package — projects override per-collection access via Payload's
 *  standard mechanism if needed. */

export const authd: Access = ({ req: { user } }) => Boolean(user)

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
