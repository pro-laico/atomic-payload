/**
 * Any authenticated user. Shared by the `Tracking` global and the
 * `PostHogProperty` collection so the two never drift.
 */
export const authd = ({ req }) => Boolean(req.user);
//# sourceMappingURL=authenticated.js.map