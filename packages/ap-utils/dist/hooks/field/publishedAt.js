export const updatePublishedAtHook = ({ operation }) => {
    if (operation === 'update')
        return new Date();
};
//# sourceMappingURL=publishedAt.js.map