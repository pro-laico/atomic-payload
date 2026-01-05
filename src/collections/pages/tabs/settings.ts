import { type Tab } from 'payload'
import { DevModeField } from '@/fields/devMode'
import { generateAPFFields } from '@/fields/apf/storage'
import { createBreadcrumbsField } from '@payloadcms/plugin-nested-docs'

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
