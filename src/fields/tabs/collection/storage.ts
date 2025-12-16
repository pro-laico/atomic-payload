import { CollapsibleField, TabAsField } from 'payload'

type StorageTabType = (args?: { filter?: ('classes' | 'forms' | 'actions')[] }) => TabAsField

/**Used to add a tab to the admin panel that displays the stored atomic classes and forms.*/
export const StorageTab: StorageTabType = ({ filter = ['classes', 'forms', 'actions'] } = {}) => {
  const allFields: Record<'classes' | 'forms' | 'actions', CollapsibleField> = {
    classes: {
      type: 'collapsible',
      label: 'Class Names',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'storedAtomicClasses',
          type: 'json',
          admin: { readOnly: true },
          typescriptSchema: [() => ({ type: 'array', items: { type: 'string' } })],
        },
      ],
    },
    forms: {
      type: 'collapsible',
      label: 'Forms',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'storedAtomicForms',
          type: 'json',
          admin: { readOnly: true },
          typescriptSchema: [() => ({ type: 'array', items: { $ref: '#/definitions/StoredAtomicForm' } })],
        },
      ],
    },
    actions: {
      type: 'collapsible',
      label: 'Actions',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'storedAtomicActions',
          type: 'json',
          admin: { readOnly: true },
          typescriptSchema: [() => ({ $ref: '#/definitions/StoredAtomicActions' })],
        },
      ],
    },
  }

  const filteredFields =
    filter.length > 0
      ? Object.values(Object.fromEntries(Object.entries(allFields).filter(([key]) => filter.includes(key))))
      : Object.values(allFields)

  return { type: 'tab', label: 'Storage', fields: filteredFields }
}
