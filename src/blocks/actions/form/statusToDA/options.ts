import { z } from '@/ts/zap'
import type { ActionProcessFunction } from '@/ts/types'

const processFunction: ActionProcessFunction<'ActFormStatusToDA'> = ({ formName, data, useForm, initialValuesMap }) => {
  const key = formName || useForm
  if (!key) throw new Error('ActFormError: formName or useForm is required')

  const hasFormKey = initialValuesMap.get(key)
  if (!hasFormKey) console.warn('ActFormStatusToDA: No form found with the key:', key)

  const Att: z.ap.Type<'AttFormStatusToDA'> = { type: 'AttFormStatusToDA', key }
  data.attributers.push(Att)
}

export const ActFormStatusToDA = { processFunction }
