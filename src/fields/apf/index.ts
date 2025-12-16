import deepMerge from '@/utilities/deepMerge'
import { APFieldPath, APFieldLabelPath } from '@/ui'
import type { APFieldType, APArgs, APReturn } from '@/ts/types'

/** Filters out undefined values from an object */
function definedProps<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as Partial<T>
}

/** Utility Field For Adding Atomic Payload Functionality to Fields */
export function APField(args: APArgs<'text'>): APReturn<'text'>
export function APField(args: APArgs<'select'>): APReturn<'select'>
export function APField(args: APArgs<'number'>): APReturn<'number'>
export function APField(args: APArgs<'textarea'>): APReturn<'textarea'>
export function APField(args: APArgs<'checkbox'>): APReturn<'checkbox'>
export function APField(args: APFieldType['args']): APFieldType['return'] {
  const { type, name, apf, docLink, ...baseArgs } = args

  const possiblyUndefinedProps = definedProps({ docLink })

  const baseField = {
    name,
    admin: {
      components: {
        Field: {
          path: APFieldPath,
          clientProps: { type, apf, ...possiblyUndefinedProps },
        },
        // Fields Select & Number Use This Since We Use The Payload Field Component
        Label: {
          path: APFieldLabelPath,
          clientProps: { type, apf, ...possiblyUndefinedProps },
        },
      },
    },
  }

  switch (type) {
    case 'text': {
      const { kebab, ...rest } = baseArgs as APArgs<'text'>

      if (kebab) Object.assign(baseField.admin.components.Field.clientProps!, { kebab: args.kebab })

      return deepMerge({ type: 'text', ...baseField }, rest)
    }
    case 'textarea': {
      const { kebab, ...rest } = baseArgs as APArgs<'textarea'>

      if (kebab) Object.assign(baseField.admin.components.Field.clientProps!, { kebab: args.kebab })

      return deepMerge({ type: 'textarea', ...baseField }, rest)
    }
    case 'checkbox': {
      const { ...rest } = baseArgs as APArgs<'checkbox'>

      return deepMerge({ type: 'checkbox', ...baseField }, rest)
    }
    case 'select': {
      const { options, ...rest } = baseArgs as APArgs<'select'>

      return deepMerge({ type: 'select', options, ...baseField }, rest)
    }
    case 'number': {
      const { ...rest } = baseArgs as APArgs<'number'>

      return deepMerge({ type: 'number', ...baseField }, rest)
    }
  }
}
