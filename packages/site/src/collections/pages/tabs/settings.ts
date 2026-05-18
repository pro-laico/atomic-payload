import { createBreadcrumbsField } from '@payloadcms/plugin-nested-docs'
import { DevModeField, generateAPFFields } from '@pro-laico/core'
import type { Tab } from 'payload'

export const SettingsTab = () => {
  const settingsField: Tab = {
    label: 'Settings',
    fields: [
      DevModeField(),
      createBreadcrumbsField('pages', { name: 'breadcrumbs', admin: { initCollapsed: true } }),
      ...generateAPFFields(['form', 'page', 'pages', 'actions', 'classes', 'seo', 'sitemap']),
    ],
  }

  return settingsField
}
