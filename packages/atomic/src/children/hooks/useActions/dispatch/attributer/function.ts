import type { AttributerType } from '@pro-laico/atomic/actions/schema'
import type { AttFunction } from '@pro-laico/atomic/actions'
//Functions
import { AttCCToDA } from './cCToDA/function'
import { AttBoolToDA } from './boolToDA/function'
import { AttTextToDA } from './textToDA/function'
import { AttFormErrorToDA } from './errorToDA/function'
import { AttFormStatusToDA } from './statusToDA/function'

const AttributerRegistry = { AttCCToDA, AttBoolToDA, AttTextToDA, AttFormStatusToDA, AttFormErrorToDA }

export const handleAttributerActions: AttFunction<AttributerType[]> = ({ actions, context }) => {
  if (!actions) return
  const result = actions.reduce((acc: Record<string, string>, action) => {
    const attributer = AttributerRegistry[action.type as keyof typeof AttributerRegistry] as AttFunction<typeof action.type>
    return { ...acc, ...(attributer({ ...action, context }) || {}) }
  }, {})
  return Object.keys(result).length === 0 ? undefined : result
}
