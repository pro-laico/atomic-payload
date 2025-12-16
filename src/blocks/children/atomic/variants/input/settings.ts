import { APField } from '@/fields/apf'
import type { GroupField } from 'payload'
import autocompleteOptions from './autoCompleteOptions'
import { TextSettingsTab } from './variants/text/settings'
import { RadioSettingsTab } from './variants/radio/settings'
import { NumberSettingsTab } from './variants/number/settings'
import { CheckboxSettingsTab } from './variants/checkBox/settings'
import { AtomicInputTypes } from '@/ts/types/payload-types'

const allowed: AtomicInputTypes[] = ['text', 'textarea', 'email', 'number']

export const InputSettingsTab: GroupField = {
  type: 'group',
  label: 'Input Settings',
  admin: { hideGutter: true, condition: (_, sd) => Boolean(sd?.type === 'input') },
  fields: [
    APField({
      apf: ['form'],
      type: 'select',
      required: true,
      name: 'autocomplete',
      options: autocompleteOptions,
      interfaceName: 'AutocompleteOptions',
      admin: {
        width: '25%',
        condition: (_, sd) => Boolean(sd?.type === 'input' && allowed.includes(sd?.inputType)),
        description: 'Determines what suggestions are shown by the browser for the input.',
      },
    }),
    TextSettingsTab,
    NumberSettingsTab,
    CheckboxSettingsTab,
    RadioSettingsTab,
  ],
}
