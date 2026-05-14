export const updateHrefHook = ({ previousValue, data }) => {
    const lastBreadcrumbUrl = data?.breadcrumbs[data?.breadcrumbs?.length - 1]?.url;
    if (previousValue !== lastBreadcrumbUrl)
        return lastBreadcrumbUrl;
};
//# sourceMappingURL=href.js.map