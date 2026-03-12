import { type Tab } from 'payload'
import { APField } from '@/fields/apf'
import { TokenValueArrayField } from '@/fields/designSets/value'

export const VariablesTab = () => {
  const variablesField: Tab = {
    label: 'Variables',
    fields: [
      {
        type: 'group',
        name: 'defaults',
        admin: { hideGutter: true, description: 'Sets the value for the corresponding css variable.' },
        fields: [
          {
            type: 'row',
            fields: [
              APField({ type: 'text', apf: ['classes'], name: 'spacing', defaultValue: '0.25rem', admin: { width: '25%' } }),
              APField({ type: 'text', apf: ['classes'], name: 'radius', defaultValue: '0.625rem', admin: { width: '25%' } }),
            ],
          },
        ],
      },
      TokenValueArrayField('variables', { description: 'CSS Variables that can be used anywhere. Creates an inline class as well.' }),
    ],
  }

  return variablesField
}
