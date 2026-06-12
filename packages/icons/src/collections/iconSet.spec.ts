import type { Field, TabsField, UIField } from 'payload'
import { describe, expect, it } from 'vitest'

import { createIconSetCollection, IconUsagePanelPath } from './iconSet'

/** Pulls the Settings tab's fields out of the IconSet config. */
const settingsFields = (fields: Field[]): Field[] => {
  const tabsField = fields.find((f): f is TabsField => f.type === 'tabs')
  if (!tabsField) throw new Error('no tabs field')
  const settings = tabsField.tabs.find((t) => t.label === 'Settings')
  if (!settings) throw new Error('no Settings tab')
  return settings.fields
}

const usagePanel = (fields: Field[]): UIField | undefined =>
  settingsFields(fields).find((f): f is UIField => f.type === 'ui' && 'name' in f && f.name === 'iconUsage')

describe('createIconSetCollection — usage panel', () => {
  it('omits the usage panel by default', () => {
    expect(usagePanel(createIconSetCollection().fields)).toBeUndefined()
  })

  it('adds the usage panel UI field when opted in', () => {
    const field = usagePanel(createIconSetCollection({ usagePanel: true }).fields)
    expect(field).toBeDefined()
    const component = field?.admin?.components?.Field
    expect(component).toMatchObject({
      path: IconUsagePanelPath,
      serverProps: { manifestPath: undefined, scanCommand: 'npx atomic-icons-scan' },
    })
  })

  it('forwards a custom manifest path and scan command to the panel', () => {
    const field = usagePanel(
      createIconSetCollection({ usagePanel: true, usageManifestPath: '/tmp/m.json', usageScanCommand: 'pnpm scan:icons' }).fields,
    )
    expect(field?.admin?.components?.Field).toMatchObject({
      serverProps: { manifestPath: '/tmp/m.json', scanCommand: 'pnpm scan:icons' },
    })
  })
})
