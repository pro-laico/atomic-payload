import { APField } from '@/fields/apf'

import type { CheckboxField, SelectField, TextField } from 'payload'

const portalTypeOptions = [
  { label: 'Popover', value: 'popover' },
  { label: 'Dialog', value: 'dialog' },
]

const portalTypeField: SelectField = APField({
  type: 'select',
  apf: ['actions'],
  name: 'portalType',
  required: true,
  options: portalTypeOptions,
  interfaceName: 'AtomicButtonPortalTypes',
  admin: { width: '25%', condition: (_, sd) => Boolean(sd?.type === 'button' && sd?.buttonType === 'portal') },
})

const portalNameField: TextField = APField({
  type: 'text',
  apf: ['actions'],
  name: 'portalName',
  required: true,
  admin: { condition: (_, sd) => Boolean(sd?.type === 'button' && sd?.buttonType === 'portal'), width: '25%' },
})

const portalPersistedField: CheckboxField = APField({
  type: 'checkbox',
  apf: ['actions'],
  name: 'persisted',
  admin: { condition: (_, sd) => Boolean(sd?.type === 'button' && sd?.buttonType === 'portal' && sd?.portalName), width: '25%' },
})

export const PortalControlsFields: [SelectField, TextField, CheckboxField] = [portalTypeField, portalNameField, portalPersistedField]
