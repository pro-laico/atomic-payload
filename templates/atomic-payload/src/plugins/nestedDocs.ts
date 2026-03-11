import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'

export const nestedDocsPluginConfig = nestedDocsPlugin({
  collections: ['pages'],
  parentFieldSlug: 'parent',
  breadcrumbsFieldSlug: 'breadcrumbs',
  generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  generateLabel: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
})
