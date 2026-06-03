/**
 * Require a text field only when its enable-flag (a toggle at the document root)
 * is on. Payload enforces `required: true` even for fields hidden by
 * `admin.condition`, so a plain `required` on a provider field would block
 * saving the `Tracking` global whenever that provider is disabled. This enforces
 * the requirement exactly when the provider is actually enabled.
 */
export const requiredWhenEnabled = (enableFlag, message) => (value, { data }) => {
    const enabled = Boolean(data?.[enableFlag]);
    if (enabled && (value === undefined || value === null || value === ''))
        return message;
    return true;
};
//# sourceMappingURL=validators.js.map