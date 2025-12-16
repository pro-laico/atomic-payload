import { GroupField } from 'payload'
import { FormFields } from './variants/form/controlBar'
import { TagControlBar } from './variants/tag/controlBar'
import { InputTypeField } from './variants/input/typeField'
import { ButtonTypeField } from './variants/button/typeField'
import { InputControlBar } from './variants/input/controlBar'
import { LinkControlBarFields } from './variants/button/variants/link/controlBar'
import { PortalControlsFields } from './variants/button/variants/portal/controlBar'

const atomicTypeOptions = [
  { label: 'Tag', value: 'tag' },
  { label: 'Form', value: 'form' },
  { label: 'Input', value: 'input' },
  { label: 'Button', value: 'button' },
]

export const AtomicBlockControlBar: GroupField = {
  type: 'group',
  admin: { hideGutter: true },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'tag',
          admin: { width: '25%' },
          interfaceName: 'AtomicChildVariants',
          options: atomicTypeOptions,
        },
        ...TagControlBar,
        ButtonTypeField,
        InputTypeField,
        ...FormFields,
        ...InputControlBar,
        ...PortalControlsFields,
      ],
    },
    LinkControlBarFields,
  ],
}
