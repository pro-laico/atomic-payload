// TODO: Make Color Picker Component
import { z } from '@pro-laico/ap-zap'
import { type Tab } from 'payload'
import { ColorLabelPath } from '../../paths'
import { APField } from '@pro-laico/ap-core'
import { onArraySetAPFShallow } from '@pro-laico/ap-core'

export const UnoColors = z.ap.add(z.record(z.string(), z.string().or(z.record(z.string(), z.string()))), { id: 'UnoColors' })
export const designSetColors = z.ap.add(z.array(z.object({ name: z.string(), light: z.string(), dark: z.string() })), { id: 'DesignSetColors' })

export const ColorsTab = () => {
  const colorsField: Tab = {
    label: 'Colors',
    fields: [
      {
        type: 'array',
        name: 'colors',
        typescriptSchema: [() => ({ $ref: `#/definitions/DesignSetColors` })],
        admin: { initCollapsed: true, components: { RowLabel: { path: ColorLabelPath } } },
        fields: [
          APField({ type: 'text', apf: ['classes'], name: 'name', required: true, kebab: true }),
          APField({ type: 'text', apf: ['classes'], name: 'light', required: true }),
          APField({ type: 'text', apf: ['classes'], name: 'dark', required: true }),
        ],
        hooks: { beforeValidate: [onArraySetAPFShallow(['classes'])] },
      },
    ],
  }

  return colorsField
}
