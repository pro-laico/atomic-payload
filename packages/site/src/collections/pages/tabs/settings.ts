import type { Tab } from 'payload'
import { createBreadcrumbsField } from '@payloadcms/plugin-nested-docs'

import { type APFunction, DevModeField, generateAPFFields } from '@pro-laico/core'

/**
 * @param apFunctions the page's APF list — passed in from the Pages collection
 * so the admin controls (`APFControlsPath` clientProps) and the generated APF
 * storage fields share one source of truth and can't drift.
 */
export const SettingsTab = (apFunctions: APFunction[]) => {
  const settingsField: Tab = {
    label: 'Settings',
    fields: [
      DevModeField(),
      createBreadcrumbsField('pages', { name: 'breadcrumbs', admin: { initCollapsed: true } }),
      ...generateAPFFields(apFunctions),
    ],
  }

  return settingsField
}
