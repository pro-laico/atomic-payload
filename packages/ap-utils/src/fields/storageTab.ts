import type { CollapsibleField, TabAsField } from 'payload'

type StorageKey = 'classes' | 'forms' | 'actions'

const defaultFilter: StorageKey[] = ['classes', 'forms', 'actions']

/** Adds a `Storage` tab containing read-only JSON fields for atomic classes, forms, and actions. */
export const StorageTab = ({ filter = defaultFilter }: { filter?: StorageKey[] } = {}): TabAsField => {
  const allFields: Record<StorageKey, CollapsibleField> = {
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

  const filteredFields = filter.length > 0 ? filter.map((key) => allFields[key]) : Object.values(allFields)

  return { type: 'tab', label: 'Storage', fields: filteredFields }
}
