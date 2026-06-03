export const updateHrefHook = ({ previousValue, data }) => {
    // Guard the array first: on a create (or any write before nested-docs computes
    // breadcrumbs) `data.breadcrumbs` is undefined, and indexing it directly would
    // throw `Cannot read properties of undefined`.
    const breadcrumbs = data?.breadcrumbs;
    if (!breadcrumbs?.length)
        return previousValue;
    const lastBreadcrumbUrl = breadcrumbs[breadcrumbs.length - 1]?.url;
    if (previousValue !== lastBreadcrumbUrl)
        return lastBreadcrumbUrl;
};
//# sourceMappingURL=href.js.map