import { ArrayField } from 'payload'
import { KeyTextField } from '@/fields/actions'

const d = {
  array: 'Add static data attributes to the element.',
  key: 'The name of the key to set.',
  value: 'The string value of the data-key. Set to "true" to have a data attribute applied with no string value.',
}

/**Used to add a field to the admin panel that allows the user to add static data attributes to the element.*/
export const StaticDataAttributesField = (location: 'trigger' | 'content') => {
  const sda: ArrayField = {
    type: 'array',
    name: 'staticDataAttributes',
    interfaceName: 'StaticDataAttributes',
    admin: { description: d.array, condition: (_, sd) => Boolean(sd.type !== 'button') || Boolean(sd.buttonType === 'portal') },
    fields: [
      KeyTextField({ required: true, admin: { width: '25%', description: d.key } }),
      { name: 'value', type: 'text', required: true, admin: { description: d.value } },
    ],
  }

  if (location === 'trigger') {
    sda.name = 'triggerStaticDataAttributes'
    sda.admin!.condition = (_, sd) => Boolean(sd?.type === 'button')
  }

  return sda
}
