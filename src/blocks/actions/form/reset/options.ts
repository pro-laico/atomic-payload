import { z } from '@/ts/zap'
import type { ActionProcessFunction, ActionDefaultFunction } from '@/ts/types'

const processFunction: ActionProcessFunction<'ActResetForm'> = ({ formName, useForm, data, initialValuesMap }) => {
  const key = formName || useForm
  if (!key) throw new Error('ActFormError: formName or useForm is required')

  const hasFormKey = initialValuesMap.get(key)
  if (!hasFormKey) console.warn('ActFormError: No form found with the key:', key)

  const Run: z.ap.Type<'RunResetForm'> = { type: 'RunResetForm', formName: key }
  data.runners.push(Run)
  const Att: z.ap.Type<'AttFormStatusToDA'> = { type: 'AttFormStatusToDA', key }
  data.attributers.push(Att)
}

const contentDefaults: ActionDefaultFunction = ({ block, data: { actions, attributers } }) => {
  if (block.blockType === 'AtomicChild') {
    const { formName, type } = block
    if (!formName) return

    if (type === 'form' && !actions?.includes('ActResetForm')) {
      actions.push('ActResetForm')
      const Att: z.ap.Type<'AttFormStatusToDA'> = { type: 'AttFormStatusToDA', key: formName }
      attributers.push(Att)
    }
  }
}

export const ActResetForm = { processFunction, contentDefaults }
