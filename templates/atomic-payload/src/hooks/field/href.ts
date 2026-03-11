import type { FieldHook } from 'payload'

export const updateHrefHook: FieldHook = ({ previousValue, data }) => {
  const lastBreadcrumbUrl = data?.breadcrumbs[data?.breadcrumbs?.length - 1]?.url
  if (previousValue !== lastBreadcrumbUrl) return lastBreadcrumbUrl
}
