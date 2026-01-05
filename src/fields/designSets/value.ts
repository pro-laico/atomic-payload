import { z } from '@/ts/zap'
import { APField } from '@/fields/apf'
import type { TextField } from 'payload'
import type { ArrayField } from 'payload'
import { DesignTokenLabelPath } from '@/ui'
import { onArraySetAPFShallow } from '@/hooks/field/apf'

/** Creates a value field for use in the design sets collection. */
export const ValueField: TextField = APField({ name: 'value', type: 'text', apf: ['classes'], required: true })

type ValuesFieldProps = (args?: { name?: string; defaultValue?: { value: string }[] }) => ArrayField

/** Creates an array of value fields for use in the design sets collection. */
export const ValuesField: ValuesFieldProps = (args) => {
  const valueField: ArrayField = {
    name: args?.name || 'values',
    type: 'array',
    required: true,
    fields: [ValueField],
    hooks: { beforeValidate: [onArraySetAPFShallow(['classes'])] },
  }

  if (args?.defaultValue) valueField.defaultValue = args.defaultValue

  return valueField
}

export const TokenString = z.ap.add(
  z
    .array(z.object({ name: z.string(), value: z.string() }))
    .nullable()
    .optional(),
  { id: 'TokenString' },
)

type TokenValueArrayFieldExtras = { description?: string; defaultValue?: { name: string; value: string }[] }

/** Creates an array field with a row label component and a value field for use in the design sets collection */
export const TokenValueArrayField = (name: string, extras?: TokenValueArrayFieldExtras) => {
  const valueField: ArrayField = {
    name: name,
    type: 'array',
    admin: { components: { RowLabel: { path: DesignTokenLabelPath } } },
    fields: [APField({ type: 'text', name: 'name', apf: ['classes'], required: true, kebab: true }), ValueField],
    hooks: { beforeValidate: [onArraySetAPFShallow(['classes'])] },
    typescriptSchema: [() => ({ $ref: `#/definitions/TokenString` })],
  }

  if (extras?.description) valueField.admin!.description = extras.description
  if (extras?.defaultValue) valueField.defaultValue = extras.defaultValue

  return valueField
}

export const TokenStringArray = z.ap.add(
  z
    .array(z.object({ name: z.string(), values: z.array(z.object({ value: z.string() })) }))
    .nullable()
    .optional(),
  { id: 'TokenStringArray' },
)

type TokenValuesArrayFieldExtras = { description?: string; defaultValue?: TokenValueArrayFieldExtras['defaultValue'][] }

/** Creates an array field with a row label component and a name field for use in the design sets collection.*/
export const TokenValuesArrayField = (name: string, extras?: TokenValuesArrayFieldExtras) => {
  const valueField: ArrayField = {
    name: name,
    type: 'array',
    admin: { components: { RowLabel: { path: DesignTokenLabelPath } } },
    fields: [APField({ type: 'text', name: 'name', apf: ['classes'], required: true, kebab: true }), ValuesField()],
    hooks: { beforeValidate: [onArraySetAPFShallow(['classes'])] },
    typescriptSchema: [() => ({ $ref: `#/definitions/TokenStringArray` })],
  }

  if (extras?.description) valueField.admin!.description = extras.description
  if (extras?.defaultValue) valueField.defaultValue = extras.defaultValue

  return valueField
}
