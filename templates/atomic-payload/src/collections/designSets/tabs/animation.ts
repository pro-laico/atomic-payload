import { z } from '@/ts/zap'
import { type Tab } from 'payload'
import { APField } from '@/fields/apf'
import { AnimationLabelPath } from '@/ui'
import { onArraySetAPFShallow } from '@/hooks/field/apf'
import { TokenValueArrayField, TokenValuesArrayField } from '@/fields/designSets/value'

export const unoThemeAnimation = z.ap.add(
  z.object({
    category: z.ap.get('RSS').optional(),
    keyframes: z.ap.get('RSS').optional(),
    durations: z.ap.get('RSS').optional(),
    timingFns: z.ap.get('RSS').optional(),
    properties: z.ap.get('RSRSS').optional(),
    counts: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
  }),
  { id: 'UnoThemeAnimation' },
)

const ds = {
  ease: 'The ease of the animation.',
  duration: 'The length of the animation in seconds.',
  keyframes: 'The @keyframes information for the animation.',
  timingFns: 'Interpolation functions like linear/ease-in-out.',
  counts: 'The times the animation should play, either infinite or a number.',
  properties: 'Special properties like transform-origin and backface-visibility.',
  name: 'The name of the animation used in class names fields. Capitals will be lowercased. Spaces will be replaced with hyphens (-). So type freely.',
}

export const AnimationsTab = () => {
  const storageField: Tab = {
    label: 'Animations',
    admin: { description: 'Add custom animations here. They can be called in other atomic classes.' },
    fields: [
      {
        type: 'collapsible',
        label: 'Animations',
        admin: { initCollapsed: true },
        fields: [
          {
            name: 'animation',
            type: 'array',
            admin: { components: { RowLabel: { path: AnimationLabelPath } } },
            fields: [
              APField({
                type: 'textarea',
                apf: ['classes'],
                name: 'name',
                label: 'Animations Atomic Class Name',
                required: true,
                kebab: true,
                admin: { description: ds.name },
              }),
              APField({ type: 'text', apf: ['classes'], name: 'keyframes', required: true, admin: { description: ds.keyframes } }),
              APField({ type: 'text', apf: ['classes'], name: 'duration', admin: { description: ds.duration } }),
              APField({ type: 'text', apf: ['classes'], name: 'timingFns', admin: { description: ds.timingFns } }),
              APField({ type: 'text', apf: ['classes'], name: 'properties', admin: { description: ds.properties } }),
              APField({ type: 'text', apf: ['classes'], name: 'counts', admin: { description: ds.counts } }),
              APField({ type: 'text', apf: ['classes'], name: 'ease', admin: { description: ds.ease } }),
            ],
            hooks: { beforeValidate: [onArraySetAPFShallow(['classes'])] },
          },
        ],
      },
      TokenValueArrayField('ease'),
      TokenValuesArrayField('property'),
    ],
  }

  return storageField
}
