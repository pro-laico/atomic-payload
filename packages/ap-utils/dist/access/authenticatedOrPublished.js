export const authenticatedOrPublished = ({ req: { user } }) => {
    if (user)
        return true;
    return { _status: { equals: 'published' } };
};
//# sourceMappingURL=authenticatedOrPublished.js.map