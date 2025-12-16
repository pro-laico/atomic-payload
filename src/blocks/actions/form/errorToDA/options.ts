import { z } from '@/ts/zap'
import type { ActionProcessFunction } from '@/ts/types'

const processFunction: ActionProcessFunction<'ActFormErrorToDA'> = ({ formName, inputName, data, useForm, initialValuesMap }) => {
  const key = formName || useForm
  if (!key) throw new Error('ActFormError: formName or useForm is required')

  const hasFormKey = initialValuesMap.get(key)
  if (!hasFormKey) console.warn('ActFormError: No form found with the key:', key)

  const Att: z.ap.Type<'AttFormErrorToDA'> = { type: 'AttFormErrorToDA', key, inputName }
  data.attributers.push(Att)
}

export const ActFormErrorToDA = { processFunction }
