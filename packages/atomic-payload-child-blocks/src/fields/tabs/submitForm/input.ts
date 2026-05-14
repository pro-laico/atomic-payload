import { GroupField } from 'payload'
import { APField } from '@pro-laico/atomic-payload-apf'
import { inputFunctionsBlockTemplate } from '../../blocks/submitForm/input'

export const inputTab: GroupField = {
  type: 'group',
  label: false,
  admin: { hideGutter: true, condition: (_, sd) => Boolean(sd?.type === 'input') },
  fields: [
    APField({ type: 'checkbox', apf: ['form'], name: 'required', admin: { description: 'If checked, this input field is required.' } }),
    inputFunctionsBlockTemplate('Sanitation'),
    inputFunctionsBlockTemplate('Validation'),
  ],
}
