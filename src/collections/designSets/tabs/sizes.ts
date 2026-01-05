import { type Tab } from 'payload'
import { TokenValueArrayField } from '../../../fields/designSets/value'

export const SizesTab = () => {
  const sizesField: Tab = {
    label: 'Sizes',
    fields: [
      TokenValueArrayField('container'),
      TokenValueArrayField('breakpoint', {
        description: 'The breakpoint values to apply to the breakpoint css variable.',
        defaultValue: [
          { name: '3xl', value: '100rem' },
          { name: '4xl', value: '125rem' },
        ],
      }),
      TokenValueArrayField('spacing'),
      TokenValueArrayField('radius', {
        description: 'The radius values to apply to the radius css variable.',
        defaultValue: [
          { name: 'sm', value: 'calc(var(--radius) - 4px)' },
          { name: 'md', value: 'calc(var(--radius) - 2px)' },
          { name: 'lg', value: 'var(--radius)' },
          { name: 'xl', value: 'calc(var(--radius) + 4px)' },
        ],
      }),
    ],
  }

  return sizesField
}
