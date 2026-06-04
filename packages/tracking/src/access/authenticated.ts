import type { Access } from 'payload'

/** Any authenticated user. Used by the `Tracking` global's read/update access. */
export const authd: Access = ({ req }) => Boolean(req.user)
