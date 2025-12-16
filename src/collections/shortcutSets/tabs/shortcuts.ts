import { type Tab } from 'payload'
import { APField } from '@/fields/apf'
import { ShortcutLabelPath } from '@/ui'
import { ClassNameField } from '@/fields/className'
import { onArraySetAPFShallow } from '@/hooks/field/apf'
import { defaultShortcuts } from '@/collections/shortcutSets/defaults'
import { protectedNames } from '@/collections/shortcutSets/protectedNames'

const d = {
  name: 'The name of the shortcut. This is used to identify the shortcut in the code.',
  ds: 'Default shortcuts are set in the project code at /src/collections/shortcutSets/defaults.ts',
}

export const ShortcutsTab = () => {
  const settingsField: Tab = {
    label: 'Shortcuts',
    fields: [
      {
        name: 'shortcuts',
        type: 'array',
        required: true,
        admin: { components: { RowLabel: ShortcutLabelPath } },
        fields: [
          {
            type: 'row',
            fields: [
              APField({
                type: 'text',
                name: 'name',
                apf: ['classes'],
                required: true,
                admin: { width: '75%', description: d.name },
                kebab: true,
                validate: (val, options) => {
                  if (options.event !== 'onChange') return true
                  if (val) return 'Shortcut name is required.'
                  if (val === 'default') return 'The name "default" is reserved for the default shortcuts.'
                  if (val && typeof val === 'string' && protectedNames.includes(val.split('-')[0]))
                    return `The name "${val.split('-')[0]}" is protected and cannot be used as the first part of a shortcut name.`
                  return true
                },
              }),
            ],
          },
          ClassNameField({ label: 'Atomic Classes' }),
        ],
      },
      {
        name: 'defaultShortcuts',
        type: 'array',
        required: false,
        defaultValue: defaultShortcuts,
        admin: { readOnly: true, isSortable: false, initCollapsed: true, description: d.ds, components: { RowLabel: ShortcutLabelPath } },
        fields: [
          {
            type: 'row',
            fields: [
              APField({ type: 'text', apf: ['classes'], name: 'name', required: true, kebab: true, admin: { readOnly: true, width: '75%' } }),
              APField({ type: 'checkbox', apf: ['classes'], name: 'mod', label: 'Mod', admin: { readOnly: true, width: '25%' } }),
            ],
          },
          ClassNameField({ label: 'Atomic Classes', admin: { readOnly: true } }),
        ],
        hooks: { beforeValidate: [onArraySetAPFShallow(['classes'])] },
      },
    ],
  }

  return settingsField
}
