import { SelectField } from 'payload'
import deepMerge from '@/utilities/deepMerge'

type ModalFieldType = (args?: Partial<SelectField>) => SelectField

const description = 'Determines if you can interact outside the opened portal. Defaults to window, which allows interaction outside the portal.'
const options = [
  { label: 'Trap Focus', value: 'trap-focus' },
  { label: 'Block', value: 'Block' },
  { label: 'Window', value: 'Window' },
]

export const ModalField: ModalFieldType = (args) => {
  const modalField: SelectField = { name: 'modal', type: 'select', label: 'Trap Focus', interfaceName: 'trapFocus', options, admin: { description } }
  return deepMerge(modalField, args)
}
