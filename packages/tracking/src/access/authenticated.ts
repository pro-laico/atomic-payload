import type { Access } from 'payload'

/**
 * Any authenticated user. Shared by the `Tracking` global and the
 * `PostHogProperty` collection so the two never drift.
 */
export const authd: Access = ({ req }) => Boolean(req.user)
