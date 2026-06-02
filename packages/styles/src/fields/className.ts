import type { APArgs, ClassNameFieldWrapper } from '@pro-laico/core'
import { APField, deepMerge } from '@pro-laico/core'

type PresetFields = 'apf' | 'type' | 'name'

/** The reusable "atomic classes" textarea field. Tagged `apf: ['classes']` so
 *  the CSS processor (`atomicHook` / `cssHook`) collects its value into the
 *  generated stylesheet. Owned by `@pro-laico/styles` because it is the entry
 *  point through which users feed Tailwind/UnoCSS classes into CSS processing.
 *
 *  Block factories (in `@pro-laico/icons`, `images`, `mux-video`, `richtext`,
 *  and `@pro-laico/atomic`'s children) accept this via the
 *  {@link ClassNameFieldWrapper} type and thread it in through
 *  `childBlocksPlugin({ classNameField })`, so those packages don't depend on
 *  `@pro-laico/styles` themselves. */
export const ClassNameField: ClassNameFieldWrapper = (args) => {
  let namePrefix = ''
  let rest: Omit<APArgs<'textarea'>, PresetFields> | undefined

  if (args) {
    const { namePrefix: namePrefixArg, ...restArg } = args
    namePrefix = namePrefixArg || ''
    rest = restArg
  }

  const baseField: APArgs<'textarea'> = {
    type: 'textarea',
    apf: ['classes'],
    name: `${namePrefix}ClassName`,
    docLink: 'https://atomicpayload.com/fields/classname',
    admin: { description: 'Add atomic style classes or shortcuts here.' },
  }

  return APField(deepMerge(baseField, rest))
}
