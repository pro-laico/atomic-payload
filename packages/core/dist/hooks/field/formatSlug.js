export const formatSlug = (val) => val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase();
export const formatSlugHook = (fallback) => ({ data, operation, value }) => {
    if (typeof value === 'string')
        return formatSlug(value);
    if (operation === 'create' || !data?.slug) {
        const fallbackData = data?.[fallback];
        if (fallbackData && typeof fallbackData === 'string') {
            return formatSlug(fallbackData);
        }
    }
    return value;
};
//# sourceMappingURL=formatSlug.js.map