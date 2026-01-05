import { type Tab } from 'payload'
import { defaultAria } from '@/collections/designSets/defaults'
import { TokenValueArrayField, TokenValuesArrayField, ValuesField } from '@/fields/designSets/value'

export const MiscellaneousTab = () => {
  const colorsField: Tab = {
    label: 'Misc',
    fields: [
      ValuesField({ name: 'aria', defaultValue: defaultAria }),
      TokenValueArrayField('blur'),
      TokenValueArrayField('media'),
      TokenValueArrayField('supports'),
      TokenValueArrayField('perspective'),
      TokenValuesArrayField('shadow'),
      TokenValuesArrayField('insetShadow'),
      TokenValuesArrayField('dropShadow'),
      TokenValuesArrayField('textShadow'),
    ],
  }

  return colorsField
}
